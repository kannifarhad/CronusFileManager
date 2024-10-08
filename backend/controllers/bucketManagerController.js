/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2019, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
 **/
const {
  ListObjectsV2Command,
  ListObjectsCommand,
} = require("@aws-sdk/client-s3");

// Convert common prefixes to folder structure
const convertCommonPrefixes = (commonPrefixes = []) => {
  return commonPrefixes.map((dir) => ({
    path: dir.Prefix,
    name: (dir.Prefix.match(/([^/]+)\/$/) || [])[1],
    created: "",
    modified: "",
    id: dir.Prefix + Date.now(),
    type: "folder",
    children: [],
    size: 0,
    private: false,
  }));
};

const convertContents = (contents) => {
  if (!Array.isArray(contents)) {
    return [];
  }
  return contents?.reduce((result, file) => {
    const path = file.Key;
    const match = path.match(/([^/]+)\.([^./]+)$/);

    // If match is null or undefined, skip this file
    if (!match || !match[2]) {
      return result;
    }

    const fileNameWithExt = match[0];
    const extension = `.${match[2]}`;

    result.push({
      path,
      name: fileNameWithExt,
      created: String(file.LastModified || ""),
      modified: String(file.LastModified || ""),
      id: file.ETag || path + Date.now(),
      type: "file",
      size: file.Size || 0,
      private: false,
      extension,
    });

    return result;
  }, []);
};

class S3Controller {
  constructor(s3Client, bucketName) {
    this.s3Client = s3Client;
    this.bucketName = bucketName;
  }

  // Recursive function to get the folder tree
  async getFolderTree(bucketName, prefix = "") {
    const params = {
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: "/", // Ensure it fetches only folder structure, not files
    };

    const command = new ListObjectsV2Command(params);
    const response = await this.s3Client.send(command);

    // Convert the common prefixes (folder names) to folder objects
    const folderList = convertCommonPrefixes(response.CommonPrefixes);

    // Recursively fetch subfolders for each folder
    for (const folder of folderList) {
      const subFolderTree = await this.getFolderTree(bucketName, folder.path);
      folder.children = subFolderTree.children; // Populate the children
    }

    return {
      path: prefix || "/",
      name: prefix ? (prefix.match(/([^/]+)\/$/) || [])[1] : "root",
      created: "null",
      id: String(Date.now()),
      modified: "null",
      type: "folder",
      size: 0,
      children: folderList,
    };
  }

  // Folder tree API handler
  async folderTree(req, res, next) {
    try {
      const bucketName = req.headers["bucket-name"];

      // Ensure bucket name exists in the headers
      if (!bucketName) {
        return res
          .status(400)
          .send({ error: "Bucket name is required in headers" });
      }

      const prefix = req.query.prefix || ""; // Optional: prefix parameter in query
      const folderTree = await this.getFolderTree(bucketName, prefix);

      res.status(200).send(folderTree);
    } catch (error) {
      console.error("Error fetching folder tree:", error);
      res.status(500).send({ error: "Error fetching folder tree" });
    }
  }

  // API handler to list files and folders in a specific path
  async folderInfo(req, res, next) {
    try {
      const bucketName = req.headers["bucket-name"];
      const { path } = req.body;

      // Ensure bucket name exists in the headers
      if (!bucketName) {
        return res
          .status(400)
          .send({ error: "Bucket name is required in headers" });
      }
      this.bucketName = bucketName;

      const command = new ListObjectsCommand({
        Bucket: this.bucketName,
        Prefix: path === "/" ? "" : path, // Empty string for root
        Delimiter: "/", // To emulate folder structure
      });

      const response = await this.s3Client.send(command);
      const result = [
        ...convertCommonPrefixes(response?.CommonPrefixes),
        ...convertContents(response?.Contents),
      ];
      res.status(200).json(result);
    } catch (error) {
      console.error("Error listing files:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = S3Controller;

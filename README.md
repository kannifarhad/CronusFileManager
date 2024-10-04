<div align="center">
<img style="display:block;margin:50px auto;" src="/frontend/public/img/logos/lightLogo.svg" height="100px"/>
<h1 style="text-align:center">Cronus File Manager</h1>
</div>


# Upcoming Release Highlights

We are excited to announce the upcoming release of our library, which will bring significant upgrades and new features to enhance your development experience.

## Key Updates on version 2 release:

- **React Upgrade to Version 18**:✅
     We will upgrade to React 18, allowing you to take advantage of the latest React features and improvements. 
- **Enhanced Drag and Drop**:  ✅
    Support for dragging and dropping multiple files will be added, streamlining the file upload process.
- **Direct File List Upload**: ✅
    Files will be uploadable by directly dropping them into the file list area, simplifying the upload process.
- **Virtual Scroll Loading**: ✅
    We will implement virtual scroll loading to address performance issues when dealing with large folders containing more than 500 files. This feature will ensure a smoother and more responsive UI.
- **State Management Transition**: ✅
    We will replace Redux with React Context. This change aligns with modern state management preferences and ensures compatibility with various stacks without technical challenges.
- **Icon Management Overhaul**: ✅
    Icons will be extracted from fonts and provided as SVGs. This will allow developers to easily replace existing icons or add new ones, providing greater flexibility and customization.
- **100% TypeScript Usage**: ✅
    The entire codebase will be fully written in TypeScript, enhancing type safety and developer experience.
- **Multiple Disk Volumes**: 
    Now you would be able to connect into multiple disk from UI by sending list of the conenction details. The disk spaces can be servers with files, S3 bucket connection that goes through backend and S3 bucket connection that works only by front-end ✅

- **Folder Tree Upload**: 🕑
    You will be able to upload an entire folder tree, including all files and subfolders, making bulk uploads more efficient.
- **S3 Bucket Support**: 🕑
    We will add support for Amazon S3 buckets. Users will be able to interact with S3 storage as if it were a regular file storage system, with the same user interface.
- **Theming Support**: 🔜
    The library will support theming, allowing developers to customize the appearance to match their application’s look and feel easily.
- **Backend Refactor and Swagger Documentation**: 🔜
    The backend will be refactored and will include Swagger documentation, providing clear and comprehensive API documentation.
- **Bug Fixes and Performance Improvements**: 🔜
    We will address numerous bugs, fix performance issues, and refactor the overall structure for better maintainability and efficiency.
- **Trash Box**: 🔜
    Implement trash box feature that will hold removed items for 30 days with possibility of recovery 

We believe these updates will significantly improve your development workflow and provide a more robust and flexible platform for your projects. Thank you for your continued support!



Filemanager with React &amp; Nodejs 
### [Demo](http://filemanager.kanni.pro)

### Used technologies
React, Redux, Material UI, Nodejs, ExpressJs

### Basic usage
Plugin has two parts: Front-end & Back-end. For initialising file manager you have to install and run both of them from terminal with commands

```shell
npm install
npm run start
```

### Design
<img src="http://api.kanni.pro/uploads/projects/filemanager/demo.gif" width="100%;"/>
-------

### Requirements
 - NodeJs min. ver 11.x.
 - NPM min. ver 6.x.

### Functionality
 - Expandable folder tree view
 - List view or Grid view of files and folders
 - Thumb or Icon view of files
 - Expand file manager to full window and minimize
 - Reload files and folders list
 - Drag & Drop to move files and folders
 - Right click (context click) on files and folder
 - Selecting items: Select all, Deselect all, Inverse selected, Select by click
 - Sorting items: By date, size, name (ascending, descending)
 - Go Back, Foward, Parent Folder
 - Copy files and folders
 - Move files and folders
 - Add new file and folder
 - Duplicate file and folder
 - Empty current folder
 - Delete selected files and folders
 - Upload files by select or Drag & Drop
 - Rename selected file or folder
 - Zip - archive selected files
 - Unzip - unarchive file
 - Get file info
 - Download file
 - Preview file
 - Return file path with callback
 - Fully Image editor - [Integrated TOAST UI Image Editor](https://ui.toast.com/tui-image-editor/)
 - Localisation texts of plugin

### Future changes
 - Refactoring of codes
 - Adding comments for better understanding to modify

-------

### MIT License
<div style="font-size:10px">
Copyright (c) 2020 Farhad Aliyev

Selling this software is prohibited. Any violation of this contract will be prosecuted.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</div>
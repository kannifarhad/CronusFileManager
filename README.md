<div align="center">
<img style="display:block;margin:50px auto;" src="/frontend/public/img/logos/lightLogo.svg" height="100px"/>
<h1 style="text-align:center">Cronus File Manager</h1>
</div>

### What would be in next releases
 - React upgrade to 18 version
 - Extract icons from font and use it like SVG. In this way developers can easly replace them with their own icons or add new ones.
 - Implement Virtual scroll loading. UI had some performance issues if folder was containing a lot of files (>500) and this feature will fix that issue.
 - Replace redux with react context (Nowadays a lot of people consider using other libraries rather than redux and because of that i had considered to switch to react features so nobody would face technical challenges with replacing it with their stack)
 - 100% usage od Typescript
 - Fixing perforamce issues and refacotring all structure
 - Add support for S3 bucket - interface would be same and user would be able interact with S3 bucket as its ordinary file storage
 - Refactor backend and add swagger documentation.


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
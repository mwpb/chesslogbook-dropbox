var dropboxUtils = {};
dropboxUtils.uploadFile = (fileName, fileContents) => {
	console.log(`Uploading file named ${fileName}.`);
	$.ajax({
	  type: "POST",
	  url: "./write/",
	  data: {
	    fileName: fileName,
	    fileContents: fileContents
	  },
	  dataType: "json"
	});
}
dropboxUtils.getFileList = () => {
	console.log("Getting file list.");
	$.ajax({
	  type: "GET",
	  url: "./listFiles/"
	}).done( (data) => {
	  viewUpdater.updateFileList(data);
	})
};
dropboxUtils.getFile = (fileName) => {
	console.log(`Getting file named ${fileName}.`);
	$.ajax({
	  type: "GET",
	  url: `./file/${fileName}`
	}).done( (data) => {
	  viewUpdater.updateFile(data);
	});
}
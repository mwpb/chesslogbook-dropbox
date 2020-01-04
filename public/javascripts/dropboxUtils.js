var dropboxUtils = {};
dropboxUtils.uploadFile = (fileName, fileContents) => {
	console.log(`Uploading file named ${fileName}.`);
	$.ajax({
	  type: "POST",
	  url: "http://localhost:3000/write/",
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
	  url: "http://localhost:3000/listFiles/"
	}).done( (data) => {
	  $("#fileListArea").val(JSON.stringify(data.entries));
	})
};
dropboxUtils.getFile = (fileName) => {
	console.log(`Getting file named ${fileName}.`);
	$.ajax({
	  type: "GET",
	  url: `http://localhost:3000/file/${fileName}`
	}).done( (data) => {
	  alert(data);
	});
}
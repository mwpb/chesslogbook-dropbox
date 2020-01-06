var viewUpdater = {};
viewUpdater.updateFileList = (data) => {
	datatable.clear()
	chesslogbook.fileList = [];
	for (var i = 0; i < data.entries.length; i++) {
		chesslogbook.fileList.push([data.entries[i].name]);
	}
	console.log(chesslogbook.fileList);
	datatable.rows.add(chesslogbook.fileList);
	datatable.draw();
}
viewUpdater.updateFile = (data) => {
	var fileString = "";
	chesslogbook.chess = new Chess();
	for(var i = 0; i < data.fileBinary.data.length; i++) {
		fileString += String.fromCharCode(data.fileBinary.data[i]);
	};
	var success = chesslogbook.chess.load_pgn(fileString);
	if (!success) {
		alert("File not recognised as a PGN file.");
	} else {
		chesslogbook.moves = chesslogbook.chess.history;
		chessBoardUtils.updateBoard();
		$("#fileContents").html(fileString);
	}
}
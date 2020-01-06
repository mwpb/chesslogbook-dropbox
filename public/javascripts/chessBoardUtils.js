var chessBoardUtils = {};
chessBoardUtils.updateBoard = () => {
	chesslogbook.board.position(chesslogbook.chess.fen(), false);
}
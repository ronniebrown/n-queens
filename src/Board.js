// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function(params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
             _             _     _
         ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
        / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
        \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
        |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

     */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
        hasRowConflictAt: function(rowIndex){
      var thisRow = this.get(rowIndex).slice();
      thisRow.sort().reverse();
      return thisRow[1] ? true : false;
    },

    hasAnyRowConflicts: function(){
      var foundConflict = false;
      for(var i = 0; i < this.rows().length; i++){
        this.hasRowConflictAt(i) && (foundConflict = true);
      }
      return foundConflict;
    },

    hasColConflictAt: function(colIndex){
      var columnArray = [];
      for (var i = 0; i < this.rows().length; i++) {
        columnArray.push(this.get(i)[colIndex]);
      }
      columnArray.sort().reverse();
      return columnArray[1] ? true : false;
    },

    hasAnyColConflicts: function(){
      var foundConflict = false; 
      for(var i = 0; i < this.rows().length; i++){
        this.hasColConflictAt(i) && (foundConflict = true);
      }
      return foundConflict; 
    },

    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow){
      var oneCount = 0;
      for(var r = 0; r < this.rows().length; r++){
        !!this.get(r)[majorDiagonalColumnIndexAtFirstRow + r] && oneCount++;
      }
      return oneCount > 1 ? true : false;
    },

    hasAnyMajorDiagonalConflicts: function(){
      var foundConflict = false;
      for(var r = this.rows().length * -1; r < this.rows().length; r++){
        this.hasMajorDiagonalConflictAt(r) && (foundConflict = true);
      }
      return foundConflict;
    },

    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow){
      var oneCount = 0;
      for (var r = 0; r < this.rows().length; r++) {
        !!this.get(r)[minorDiagonalColumnIndexAtFirstRow - r] && oneCount++;
      }
      return oneCount > 1 ? true : false;
    },

    hasAnyMinorDiagonalConflicts: function(){
      var foundConflict = false;
      for(var r = this.rows().length * 2; r > 0; r--){
        this.hasMinorDiagonalConflictAt(r) && (foundConflict = true);
      }
      return foundConflict;
    }
  });
    /*--------------------  End of Helper Functions  ---------------------*/


  

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

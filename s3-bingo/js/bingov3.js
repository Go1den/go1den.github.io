var bingoBoard = [];
var randomWeaponPool = [];
var isRandomWeaponsPoolPopulated = false;
var myBingoBoard;
var myWeaponRandomizer;

var bingo = function(weaponMap) {

	function gup( name ) {
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( window.location.href );
		if(results == null)
			 return "";
		return results[1];
	}

	var SEED = gup( 'seed' );
	if(SEED == "") return reseedPage();
	Math.seedrandom(SEED); //sets up the RNG
    myBingoBoard = new BingoBoard(weaponMap, SEED);

	var results = $("#results");
	results.append ("<p>Splatoon 3 Weapons Bingo <strong>v2</strong>&emsp;Seed: <strong>" +
	SEED + "</strong></p><p>&emsp;Join us on <strong><a href=\"https://discord.gg/CErcb4gVqE\">Discord</a></strong></p></p>");

	$('.popout').click(function() {
	    refreshBoard(false);
		var line = $(this).attr('id');
		var name = $(this).html();
		var items = [];
		var cells = $('#bingo .'+ line);
		for (var i = 0; i < 5; i++) {
		  items.push( encodeURIComponent($(cells[i]).html()) );
		}
        window.open('popout.html#'+ name +'='+ items.join(';;;'),"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=100, height=600");
	});

	$("#bingo tr td:not(.popout), #selected td").toggle(
		function () { $(this).addClass("greensquare"); },
		function () { $(this).addClass("redsquare").removeClass("greensquare"); },
		function () { $(this).removeClass("redsquare"); }
	);

	$("#row1").hover(function() { $(".row1").addClass("hover"); }, function() {	$(".row1").removeClass("hover"); });
	$("#row2").hover(function() { $(".row2").addClass("hover"); }, function() {	$(".row2").removeClass("hover"); });
	$("#row3").hover(function() { $(".row3").addClass("hover"); }, function() {	$(".row3").removeClass("hover"); });
	$("#row4").hover(function() { $(".row4").addClass("hover"); }, function() {	$(".row4").removeClass("hover"); });
	$("#row5").hover(function() { $(".row5").addClass("hover"); }, function() {	$(".row5").removeClass("hover"); });

	$("#col1").hover(function() { $(".col1").addClass("hover"); }, function() {	$(".col1").removeClass("hover"); });
	$("#col2").hover(function() { $(".col2").addClass("hover"); }, function() {	$(".col2").removeClass("hover"); });
	$("#col3").hover(function() { $(".col3").addClass("hover"); }, function() {	$(".col3").removeClass("hover"); });
	$("#col4").hover(function() { $(".col4").addClass("hover"); }, function() {	$(".col4").removeClass("hover"); });
	$("#col5").hover(function() { $(".col5").addClass("hover"); }, function() {	$(".col5").removeClass("hover"); });

	$("#tlbr").hover(function() { $(".tlbr").addClass("hover"); }, function() {	$(".tlbr").removeClass("hover"); });
	$("#bltr").hover(function() { $(".bltr").addClass("hover"); }, function() {	$(".bltr").removeClass("hover"); });

	//populate the actual table on the page
	for (i=0; i<25; i++) {
	  $('#slot'+(i+1)).append("<image width=70px height=70px src=" + myBingoBoard.board[i].image + ">");
	  $('#slot'+(i+1)).append(myBingoBoard.board[i].name);
	}

	return true;
}; // setup

function refreshBoard(showNames) {
    for (i=0; i<25; i++) {
      document.getElementById("slot" + (i+1)).innerHTML = "";

      if (showNames) {
        $('#slot'+(i+1)).append("<image width=70px height=70px src=" + myBingoBoard.board[i].image + ">");
        $('#slot'+(i+1)).append(myBingoBoard.board[i].name);
      } else {
        $('#slot'+(i+1)).append("<image src=" + myBingoBoard.board[i].image + ">");
      }
    }
}

function disableCheckboxes() {
    if (document.getElementById("randomIgnore").checked === true) {
        document.getElementById("randomObey").disabled = true;
    } else {
        document.getElementById("randomIgnore").disabled = true;
    }
    if (document.getElementById("randomCardOnly").checked === true) {
        document.getElementById("randomAll").disabled = true;
    } else {
        document.getElementById("randomCardOnly").disabled = true;
    }
    if (document.getElementById("randomNoDuplicates").checked === true) {
        document.getElementById("randomYesDuplicates").disabled = true;
    } else {
        document.getElementById("randomNoDuplicates").disabled = true;
    }
}

function initializeRandomizer() {
    disableCheckboxes();
    let isUsingAllWeapons = true;
    if (document.getElementById("randomCardOnly").checked === true) {
        isUsingAllWeapons = false;
    }
    let isAllowingRepeats = true;
    if (document.getElementById("randomNoDuplicates").checked === true) {
        isAllowingRepeats = false;
    }
    myWeaponRandomizer = new WeaponRandomizer(myBingoBoard, isUsingAllWeapons, isAllowingRepeats);
}

function updateRandomWeapon(currentObj) {
    if (currentObj === undefined || currentObj === null) {
        $('#randomWeapon').append("<td><image width=70px height=70px src=\"../sheldon/sheldon.png\"></td>");
        $('#randomWeapon').append("<td><strong style=\"color: orange\">No More Weapons</strong><br><strong style=\"color: white\">There are no more weapons to loan!</strong></td>");
    } else {
        let img = currentObj.image;
        let name = currentObj.name;
        $('#randomWeapon').append("<td><image width=70px height=70px src=" + img + "></td>");
        $('#randomWeapon').append("<td><strong style=\"color: orange\">Supplied Weapon #" + myWeaponRandomizer.getWeaponNumber() + " of " + myWeaponRandomizer.getLength() + "</strong><br><strong style=\"color: white\">You have been loaned the " + name + "!</strong></td>");
    }
    document.getElementById("randomWeapon").style = "background-color: grey";
}

function randomWeaponNext() {
    if (myWeaponRandomizer === undefined) {
        initializeRandomizer();
    }
    document.getElementById("randomWeapon").innerHTML = "";
    updateRandomWeapon(myWeaponRandomizer.nextWeapon());
}

function randomWeaponPrevious() {
    if (myWeaponRandomizer !== undefined && myWeaponRandomizer.getWeaponNumber() > 1) {
        document.getElementById("randomWeapon").innerHTML = "";
        updateRandomWeapon(myWeaponRandomizer.previousWeapon());
    }
}

function reseedPage() {
    Math.seedrandom();
	var qSeed = "?seed=" + Math.ceil(999999 * Math.random());
	window.location = qSeed;
	return false;
}

// Backwards Compatability
var srl = { bingo:bingo };
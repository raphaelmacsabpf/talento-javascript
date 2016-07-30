var G_apiAddress = "http://homolog.adsim.co:8080/refrigerantes";
var G_apiData;
var G_rowData = [];
var G_rowCount = 0;
var app = {
	//All the app functions will be placed here
	main: function() {
		app.retrieveApiData();		
	},
	hideWatingContent: function() {
		$("#app-waiting").hide();
		$("#app-table").show();
	},
	retrieveApiData: function() {
		//Retrieve data from API via JSONP
		$.getJSON("http://homolog.adsim.co:8080/refrigerantes", function(json) {
		  	G_apiData = json;
		  	//When API data is ready, the data will be processed
		  	app.buildTable();
			app.hideWatingContent();
		});
		//G_apiData = JSON.parse(response);
	},
	buildTable: function() {
		//Get select DOM Element
		var select = $('#app-select-soft-drinks');
		select.empty();
		select.append('<option value="0">Selecione</option>');
		var lenI = G_apiData.length;
		//Loop for each brand
		for(var i = 0; i < lenI; i++) {
			select.append('<optgroup label="' + G_apiData[i].nome + '">');
			var lenJ = G_apiData[i].refrigerantes.length;
			//Loop for each soft drink
			for(var j = 0; j < lenJ; j++) {
				select.append('<option value="' + i + '-' + j + '">' + G_apiData[i].refrigerantes[j].nome + '</option>');
			}
			select.append('</optgroup>');
		}
		//Creating standard rows
		for(var i = 0; i < 5; i++) {
			app.appendNewRow(i);
		}
		app.rebuildOverall();
	},
	rebuildOverall: function() {
		var overall = $("#app-html-table-overall-none")[0].outerHTML;
		overall = overall.replace('<tr hidden="" id="app-html-table-overall-none','<tr id="app-html-table-overall');
		overall = overall.replace('app-text-overall-none', 'app-text-overall-value');
		overall = overall.replace('app-button-new-row-none', 'app-button-new-row-value');
		//Remove previous overall div's
		$("#app-html-table-overall").remove();
		$("#app-table").append(overall);
		//Rebuild all event listeners
		$(".app-select-soft-drinks").off().on("change", function() {
			var row = this.parentNode.parentNode.id;
			row = row.split("-")[4];
			app.onSelectSoftDrink(this.value, row);
		});
		$(".app-html-table-row-ammount-minus").off().on("click", function() {
			var row = this.parentNode.parentNode.parentNode.id;
			row = row.split("-")[4];
			app.ammountDecrease(row);
		});
		$(".app-html-table-row-ammount-plus").off().on("click", function() {
			var row = this.parentNode.parentNode.parentNode.id;
			row = row.split("-")[4];
			app.ammountIncrease(row);
		});
		$(".app-html-table-row-ammount-text").off().change(function() {
			var row = this.parentNode.parentNode.parentNode.id;
			row = row.split("-")[4];
			app.ammountSet(row, $(".app-html-table-row-ammount-text-" + row).val());
		});
		$(".app-html-table-row-remove").off().on("click", function() {
			var row = this.parentNode.parentNode.id;
			row = row.split("-")[4];
			app.removeRow(row);
		});
		$("#app-button-new-row-value").off().on("click", function() {
			app.appendNewRow(G_rowCount);
		});
	},
	removeRow: function(rowId) {
		G_rowData[rowId].inUse = false;
		$("#app-html-table-row-" + rowId).fadeOut(200);
		app.updateRow(rowId);
	},
	ammountSet: function(row, ammount) {
		ammount = Math.floor(ammount);
		G_rowData[row].ammount = ammount;
		if(isNaN(G_rowData[row].ammount) || G_rowData[row].ammount < 0)
			G_rowData[row].ammount = 0;
		app.updateRow(row);
	},
	ammountIncrease: function(row) {
		G_rowData[row].ammount++;
		app.updateRow(row);
	},
	ammountDecrease: function(row) {
		G_rowData[row].ammount--;
		if(G_rowData[row].ammount < 0)
			G_rowData[row].ammount = 0;
		app.updateRow(row);
	},
	onSelectSoftDrink: function(id, row) {
		if(id != 0) {
			var res = id.split("-");;
			G_rowData[row].price = G_apiData[res[0]].refrigerantes[res[1]].preco;
			G_rowData[row].inUse = true;
			app.updateRow(row);
		}
	},
	updateRow: function(rowId) {
		$(".app-html-table-row-ammount-text-" + rowId).val(G_rowData[rowId].ammount);
		if(G_rowData[rowId].inUse == true) {
			$("#app-html-table-row-price-" + rowId).html(moneyString(G_rowData[rowId].price));
			$("#app-html-table-row-total-" + rowId).html(moneyString(G_rowData[rowId].price * G_rowData[rowId].ammount));
		}
		app.updateOverall();
	},
	updateOverall: function() {
		var overall = 0;
		var lenI = G_rowData.length;
		for(var i = 0; i < lenI; i++) {
			if(G_rowData[i].inUse == true) {
				overall += G_rowData[i].ammount * G_rowData[i].price;
			}
		}
		$("#app-text-overall-value").html(moneyString(overall));
	},
	appendNewRow: function(rowId) {
		G_rowCount++;
		var aux = {ammount:1, price:0, inUse:false};
		G_rowData.push(aux);
		var divStr = $("#app-html-table-row-none")[0].outerHTML;
		divStr = divStr.replace('<tr hidden="" id="app-html-table-row-none', '<tr id="app-html-table-row-' + rowId + '">');
		divStr = divStr.replace('app-html-table-row-price-none', 'app-html-table-row-price-' + rowId);
		divStr = divStr.replace('app-html-table-row-ammount-minus-none', 'app-html-table-row-ammount-minus-' + rowId);
		divStr = divStr.replace('app-html-table-row-ammount-plus-none', 'app-html-table-row-ammount-plus-' + rowId);
		divStr = divStr.replace('app-html-table-row-ammount-text-none', 'app-html-table-row-ammount-text-' + rowId)
		divStr = divStr.replace('app-html-table-row-total-none', 'app-html-table-row-total-' + rowId);
		divStr = divStr.replace('app-html-table-row-remove-none', 'app-html-table-row-remove-' + rowId);
		$("#app-table").append(divStr);
		app.rebuildOverall();
	}
}
app.main();

//Standard Functions will be placed here to facilitate call's
function moneyString(value) {
	value = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	var string = "R$ " + value;
	return string;
}
//For Smooth Scrolling
$(function() {
	$('a[href*="#"]:not([href="#"])').click(function() {
	  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	    var target = $(this.hash);
	    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	    if (target.length) {
	      $('html, body').animate({
	        scrollTop: target.offset().top
	      }, 800);
	      return false;
	    }
	  }
	});
});
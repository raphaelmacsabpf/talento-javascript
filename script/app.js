var G_apiAddress = "http://homolog.adsim.co:8080/refrigerantes";
var G_apiData;
var G_rowData = [];
var G_rowCount = 0;
var app = {
	main: function() {
		app.retrieveApiData();
		setTimeout(function() {
			app.buildTable();
			app.hideWatingContent();
		}, 1500);
		
	},
	hideWatingContent: function() {
		$("#app-waiting").hide();
		$("#app-table").show();
	},
	retrieveApiData: function() {
		var response = '[{"nome":"Companhia Cervejaria Brahma","refrigerantes":[{"nome":"Guaraná Brahma","quantidade":"350ml","preco":2.5},{"nome":"Mirinda","quantidade":"350ml","preco":2.5},{"nome":"Sukita","quantidade":"350ml","preco":2.5},{"nome":"Limão Brahma","quantidade":"350ml","preco":2.5},{"nome":"Guaraná Brahma","quantidade":"2l","preco":4.88999999999999968025576890795491635799407958984375},{"nome":"Mirinda","quantidade":"2l","preco":4.88999999999999968025576890795491635799407958984375},{"nome":"Sukita","quantidade":"2l","preco":4.88999999999999968025576890795491635799407958984375},{"nome":"Limão Brahma","quantidade":"2l","preco":4.88999999999999968025576890795491635799407958984375}]},{"nome":"The Coca-Cola Company","refrigerantes":[{"nome":"Coca-Cola","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Coca-Cola Light","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Coca Zero","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Cherry Coke","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Diet Coke","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Fanta","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Sprite","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Minuano limão","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Taí","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Kuat","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Schweppes","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Guaraná Jesus","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Crush","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Kuat","quantidade":"350ml","preco":2.9900000000000002131628207280300557613372802734375},{"nome":"Coca-Cola","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Coca-Cola Light","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Coca Zero","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Cherry Coke","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Diet Coke","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Fanta","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Sprite","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Minuano limão","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Taí","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Kuat","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Schweppes","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Guaraná Jesus","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Crush","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375},{"nome":"Kuat","quantidade":"2l","preco":6.9900000000000002131628207280300557613372802734375}]},{"nome":"PepsiCo","refrigerantes":[{"nome":"Pepsi-Cola","quantidade":"350ml","preco":3.5},{"nome":"Gatorade","quantidade":"350ml","preco":3.5},{"nome":"Seven Up","quantidade":"350ml","preco":3.5},{"nome":"Pepsi-Cola","quantidade":"2l","preco":5.5},{"nome":"Seven Up","quantidade":"2l","preco":5.75}]}]';
		
		G_apiData = JSON.parse(response);
	},
	buildTable: function() {
		var select = $('#app-select-soft-drinks');
		select.empty();
		select.append('<option value="0">Selecione</option>');
		var lenI = G_apiData.length;
		for(var i = 0; i < lenI; i++) {
			select.append('<optgroup label="' + G_apiData[i].nome + '">');
			var lenJ = G_apiData[i].refrigerantes.length;
			for(var j = 0; j < lenJ; j++) {
				select.append('<option value="' + i + '-' + j + '">' + G_apiData[i].refrigerantes[j].nome + '</option>');
			}
			select.append('</optgroup>');
		}
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
		$("#app-html-table-overall").remove();
		$("#app-table").append(overall);
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
		$("#app-html-table-row-" + rowId).fadeOut(300);
		app.updateRow(rowId);
	},
	ammountSet: function(row, ammount) {
		ammount = Math.floor(ammount);
		G_rowData[row].ammount = ammount;
		if(G_rowData[row].ammount < 0)
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
		$("#app-text-overall-value").html("R$ " + moneyString(overall));
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

function moneyString(value) {
	value = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	var string = "R$ " + value;
	return string;
}
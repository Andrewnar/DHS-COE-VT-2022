var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
var data = getScaleFreeNetwork(25);
var seed = 2;

function setDefaultLocale() {
  var defaultLocal = navigator.language;
  var select = document.getElementById("locale");
  select.selectedIndex = 0; // set fallback value
  for (var i = 0, j = select.options.length; i < j; ++i) {
    if (select.options[i].getAttribute("value") === defaultLocal) {
      select.selectedIndex = i;
      break;
    }
  }
}

function getColor(weight){
  var red = 30;
  var orange = 20;
  var yellow = 10;
  var base = 0;
  if(weight >= base && weight < yellow){
    return "#0000FF";
  }else{
    if(weight >= yellow && weight < orange){
      return "#FFFF00";
    }else{
      if(weight >= orange && weight < red){
        return "#FFA500";
      }else{
        if(weight >= red){
          return "#FF0000";
        }
      }
    }
  }
}

/*function createBaseNetwork() {
  new vis.DataSet([
    { from: 1, to: 3, value: 2 },
    { from: 1, to: 2, value: 3, color: "rgba(111,0,0)" },
    { from: 2, to: 4, value: 1 },
    { from: 2, to: 5 },
    { from: 3, to: 3 },
  ]);
}*/

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function draw() {
  destroy();
  nodes = [];
  edges = [];

  // create a network
  var container = document.getElementById("mynetwork");
  var options = {
    layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
    locale: document.getElementById("locale").value,
    interaction: { keyboard: true },
    manipulation: {
      addNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById("operation").innerText = "Add Node";
        document.getElementById("node-id").value = data.id;
        document.getElementById("node-label").value = data.label;
        document.getElementById("saveButton").onclick = saveData.bind(
          this,
          data,
          callback
        );
        document.getElementById("cancelButton").onclick = clearPopUp.bind();
        document.getElementById("network-popUp").style.display = "block";
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById("operation").innerText = "Edit Node";
        document.getElementById("node-id").value = data.id;
        document.getElementById("node-label").value = data.label;
        document.getElementById("saveButton").onclick = saveData.bind(
          this,
          data,
          callback
        );
        document.getElementById("cancelButton").onclick = cancelEdit.bind(
          this,
          callback
        );
        document.getElementById("network-popUp").style.display = "block";
      },
      addEdge: function (data, callback) {
        if (data.from == data.to) {
          var r = confirm("Do you want to connect the node to itself?");
          if (r == true) {
            callback(data);
          }
        } else {
          callback(data);
        }
      },
    },
  };
  network = new vis.Network(container, data, options);
}

function clearPopUp() {
  document.getElementById("saveButton").onclick = null;
  document.getElementById("cancelButton").onclick = null;
  document.getElementById("network-popUp").style.display = "none";
}

function cancelEdit(callback) {
  clearPopUp();
  callback(null);
}

function addToTable(data){
  // Name | C|I|A | 
  var tbody = document.getElementById('tbody');
  console.log("hello");
  //console.log(data[1]);
    var tr = "<tr>";

    tr += "<td>" + Object.values(data)[0] + "</td>" + "<td>" + Object.values(data)[3].toString() + "</td></tr>";

    /* We add the table row to the table body */
    tbody.innerHTML += tr;

}

function saveData(data, callback) {
  //console.log('called');
  data.id = document.getElementById("node-id").value;
  data.label = document.getElementById("node-label").value;
  //console.log('data: ' + Object.values(data)[3]);
  clearPopUp();
  addToTable(data);
  callback(data);
}

function init() {
  setDefaultLocale();
  draw();
}

window.addEventListener("load", () => {
  init();
});
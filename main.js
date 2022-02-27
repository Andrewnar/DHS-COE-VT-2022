var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
var data = getScaleFreeNetwork(25);
var seed = 2;
var id = 0;

assets = []

class Asset {
  // constructor(name, description, tags, parent, type) {
    constructor(name, description, tags, type, c, i, a) {
    this.id = id++;
    this.name = name;
    this.description = description;
    this.tags = tags;
    // this.parent = parent;
    this.type = type;
    this.risk_c = c;
    this.risk_i = i;
    this.risk_a = a;
    this.threats = [];
    this.children = [];
    this.threat_score = 0;
  }
}

class Threat {
  constructor(name, category, type, severity) {
    this.name = name;
    this.category = category;
    this.type = type;
    this.severity = severity;
  }
}

function getColor(weight) {
  var red = 30;
  var orange = 20;
  var yellow = 10;
  var base = 0;
  if (weight >= base && weight < yellow) {
    return "#0000FF";
  } else {
    if (weight >= yellow && weight < orange) {
      return "#FFFF00";
    } else {
      if (weight >= orange && weight < red) {
        return "#FFA500";
      } else {
        if (weight >= red) {
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
    interaction: { keyboard: true },
    manipulation: {
      addNode: function (data, callback) {
        // filling in the popup DOM elements
        // document.getElementById("asset-name").innerText = "Name";

        // document.getElementById("operation").innerText = "Add Node";
        // document.getElementById("node-id").value = data.id;
        // document.getElementById("node-label").value = data.label;
        // document.getElementById("node-CIA").value = data.cia;
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
        document.getElementById("node-CIA").value = data.cia;
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

function addToTable(data) {
  // Name | C|I|A | 
  var tbody = document.getElementById('tbody');
  console.log("hello");
  //console.log(data[1]);
  var tr = "<tr>";

  tr += "<td>" + Object.values(data)[4] + "</td>" + "<td>" + Object.values(data)[3].toString() + "</td></tr>";

  /* We add the table row to the table body */
  tbody.innerHTML += tr;

}

function saveData(data, callback) {

  var type;
  var ele = document.getElementsByName('asset-type');

  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked)
      type = ele[i].value;
  }

  var name = document.getElementById("asset-name").value;
  var description = document.getElementById("asset-description").value;

  var tags = []
  var tag_boxes = document.querySelectorAll('input[name="asset-tag"]:checked');
  Array.prototype.forEach.call(tag_boxes, function (el) {
    tags.push(el.value)
  })

  var c = document.getElementById("asset-c").value;
  var i = document.getElementById("asset-i").value;
  var a = document.getElementById("asset-a").value;


  assets.push(new Asset(name, description, tags, type, c, i, a));
  console.log(assets)

  clearPopUp();
  // addToTable(data);
  callback(data);
}

function init() {
  draw();
}

window.addEventListener("load", () => {
  init();
});
var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
var data = getScaleFreeNetwork(25);
var seed = 2;


assets = []

class Asset {
  // constructor(name, description, tags, parent, type) {
    constructor(id, name, description, tags, type, c, i, a) {
    this.id = id;
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
    return "#0000FF"; // blue
  } else if (weight >= yellow && weight < orange) {
    return "#FFFF00"; // yellow
  } else if (weight >= orange && weight < red) {
    return "#FFA500"; // orange
  } else {
    return "#FF0000"; // red
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
        document.getElementById("operation").innerText = "Add Node";
        document.getElementById("node-id").value = data.id;
       //document.getElementById("node-label").value = data.label;
        // document.getElementById("node-CIA").value = data.cia;
        document.getElementById("saveButton").onclick = saveData.bind(this,data,callback);
        document.getElementById("cancelButton").onclick = clearPopUp.bind();
        document.getElementById("network-popUp").style.display = "block";
        
        document.getElementById("type1").checked = false;
        document.getElementById("type2").checked = false;
        document.getElementById("asset-name").value=null;
        document.getElementById("asset-description").value=null;
        document.getElementById("asset-c").value=null;
        document.getElementById("asset-i").value=null;
        document.getElementById("asset-a").value=null;

        var tag_boxes = document.querySelectorAll('input[name="asset-tag"]');
        for (const tag_box in tag_boxes) {
          tag_box.checked = false;
        }
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById("operation").innerText = "Edit Node";
        document.getElementById("node-id").value = data.id;
        // document.getElementById("node-label").value = data.label;
        for(const asset in assets){
          if (asset.id == data.id){
            document.getElementById("asset-name").value = asset.name;
            document.getElementById("asset-descrption").value = asset.description;
            document.getElementById("asset-c").value = asset.risk_c;
            document.getElementById("asset-i").value = asset.risk_i;
            document.getElementById("asset-a").value = asset.risk_a;
            // document.getElementById("node-id").value = tags[0];
            var tag_boxes = document.querySelectorAll('input[name="asset-tag"]');
            for (const tag_box in tag_boxes) {
              if (tag_box.value in asset.tags) {
                tag_box.checked = true;
              }
            }
            
          }
        }
        // document.getElementById("asset-name").value = data.id;

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

function displayTable() {
  // Name | C|I|A | 


  var tbody = document.getElementById('tbody');
  if(tbody.innerHTML != null){
    tbody.innerHTML = null;
  }
  console.log("hello");
  //console.log(data[1]);
  for(asset in assets){
    console.log(asset);
    console.log(assets[asset].name);
    var tr = "<tr>";

    tr += "<td>" + assets[asset].name + "</td>" + "<td>" + assets[asset].threats + "</td>" + "<td>" + assets[asset].threat_score + "</td></tr>";
    tbody.innerHTML += tr;

  }
  /* We add the table row to the table body */

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

  data.id = document.getElementById("node-id").value;

  assets.push(new Asset(data.id, name, description, tags, type, c, i, a));
  console.log(assets)

  //data.cia = document.getElementById("node-CIA").value

  //console.log('data: ' + Object.values(data)[3]);
  data.label = name;
  clearPopUp();
  // addToTable(data);
  
  callback(data);
  displayTable();
}

function init() {
  draw();
}

window.addEventListener("load", () => {
  init();
});

filterSelection("all")
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) AddClass(x[i], "show");
  }
}

// Show filtered elements
function AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}


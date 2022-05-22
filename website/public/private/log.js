window.onload = () => {
    var httpReq = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
    httpReq.onload = () => {
        let response = JSON.parse(httpReq.responseText)
        displayData(response);
    }
    try {
        httpReq.open("GET", "log.php", true)
        httpReq.send(null)
    } catch(e) {
        console.log(e)
    }
}

let displayData = data => {
    data = removeMatt(data);
    displayTable(data);
    displayPieCharts(data);
}

let displayTable = data => {
    let table = document.querySelector('#table');


    // Init table headings
    let tableRow = document.createElement('tr');
    let labels = ['continents', 'countries', 'cities', 'regions', 'providers'];
    labels.forEach(label => {
        let tableHeading = document.createElement('th');
        let text = label[0].toUpperCase() + label.substring(1);
        tableHeading.textContent = text;
        tableRow.append(tableHeading);
    })
    table.append(tableRow);

    // Now add all data to table
    for (var i = 0; i < data['cities'].length; i++) {
        let tableRow = document.createElement('tr');
        labels.forEach(label => {
            let tableData = document.createElement('td');
            tableData.textContent = data[label][i];
            tableRow.append(tableData);
        })
        table.append(tableRow); 
    }
}

let displayPieCharts = info => {

    let ids = ['cityChart', 'countryChart', 'regionChart', 'ispChart'];
    let labels = ['cities', 'countries', 'regions', 'providers'];



    for (var i = 0; i < labels.length; i++) {
        let countMap = getCount(info[labels[i]]);
        let chart = document.getElementById(ids[i]).getContext('2d');
        getPieChart(chart, Array.from(countMap.keys()), Array.from(countMap.values()), labels[i]);
    }
    
}

let getPieChart = (chart, keys, counts, label) => {

    let cols = [];
    let numberColors = keys.length;
    let increment = Math.ceil(256 / numberColors);
    let activeCounter = 0;
    for (var i = 0; i < keys.length; i++) {
        cols.push('hsl(' + activeCounter + ', 100%, 25%)');
        activeCounter+=increment;
    }
    shuffle(cols);

    label = label[0].toUpperCase() + label.substring(1);

    const data = {
        labels: keys,
        datasets: [{
            label: label,
            data: counts,
            backgroundColor: cols,
            hoverOffset: 4,
            color: 'white'
        }]
    };
    var myChart = new Chart(chart, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            borderColor: 'black',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels : {
                        color: 'rgb(255, 255, 255)'
                    }
                },
                title: {
                    display: true,
                    text: label,
                    color: 'rgb(255, 255, 255)',
                    font: {
                        size: 24
                    }
                }
            }
        }
    })
}

// Count data up
let getCount = (data) => {
    let info = data;
    
    let map = new Map();

    info.forEach(item => {
        if (map.has(item)) {
            map.set(item, (map.get(item) + 1))
        } else {
            map.set(item, 1);
        }
    })
    return map;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  


// Remove any database references to website owner or blank entries to eliminate data skewing
let removeMatt = data => {
    const MATTIP = '68.8.228.14';
    let newData = { 
        'ips': [],
        'continents': [],
        'countries': [],
        'regions': [],
        'cities': [],
        'providers': []
    };
    for (var i = 0; i < data['cities'].length; i++) {
        if (data['ips'][i] != '' && data['ips'][i] != MATTIP) {
            let labels = ['ips', 'continents', 'countries', 'cities', 'regions', 'providers'];
            labels.forEach(label => {
                newData[label].push(data[label][i]);
            })
        }
    }
    return newData;
}


            


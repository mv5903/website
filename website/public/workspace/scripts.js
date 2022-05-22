let getResponse = () => {
    var submit = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    submit.onload = () => {
        let responseText = submit.responseText;
        responseText = JSON.parse(responseText);
        let existingDiv = document.querySelector('.existing');
        responseText.forEach(row => {
            let existingObj = document.createElement('a');
            existingObj.setAttribute('href', 'edit.html?name=' + row['name'] + '&file=' + row['file'])
            existingObj.setAttribute('target', '_blank');
            existingObj.className = 'existing-entry';
            existingObj.textContent = row['name']
            existingDiv.append(existingObj);
        })
    }
    try {
        submit.open("GET", "getExistingWorkspaces.php", true);
        submit.send(null);
    } catch (e) {}
}


let initPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    document.querySelector('.workspaceName').textContent = 'Workspace: ' + urlParams.get('name');

    document.title = 'Workspace: ' + urlParams.get('name')

    //Get JSON that corresponds to workspace and insert as divs below workspace name
    getCSVData(urlParams.get('file'))
}

var CSV = '';
var categories = '';

let getCSVData = async fileName => {
    let csvFile = await fetch('https://www.mattvandenberg.com/workspace/csv/' + fileName);
    let data = await csvFile.text();
    
    data = data.split('\r\n');

    CSV = data;
    categories = CSV[0].split('\t');

    CSV.shift();
    
    let mainDiv = document.querySelector('.names');

    CSV.forEach(row => {
        arr = row.split('\t');

        //Show each based on name
        let housingDiv = document.createElement('div');
        housingDiv.className = "name-div";
        housingDiv.textContent = arr[0];

        let popupText = '<h3 class="popup">' + arr[0] + '</h3>';
        for (var i = 1; i < arr.length; i++) {
            popupText+='<div style="text-align: left"><strong>' + categories[i] + '</strong>: ' + arr[i] + '</div><br>';
        }

        housingDiv.addEventListener('click', e => {
            Swal.fire({
                html: popupText,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Edit',
                denyButtonText: 'Delete'
            }).then(result => {
                if (result.isConfirmed) {
                    console.log('Edit')
                } else if (result.isDenied) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    }).then(result => {
                        if (result.isConfirmed) {
                            deleteEntry(housingDiv.textContent);
                            Swal.fire(
                                'Deleted!',
                                'Entry has been deleted.',
                                'success'
                            )
                        }
                    })
                }
            });
        })

        mainDiv.append(housingDiv);
        
    })
    
}

const deleteEntry = entryName => {
    let nameDivs = Object.values(document.querySelectorAll('.name-div'));
    let divToDelete = '';
    nameDivs.forEach(div => {
        if (div.textContent === entryName) {
            divToDelete = div;
        }
    })
    divToDelete.remove();
    updateWorkspace(entryName);
}


// takes a JSON that will then parse into TSV form and upload as a put request.
const updateWorkspace = async (entryName) => {
    const urlParams = new URLSearchParams(window.location.search);
    let fileName = urlParams.get('file');

    let csvFile = await fetch('https://mattvandenberg.com/workspace/csv/' + fileName);
    let data = await csvFile.text();

    data = data.split('\r\n');

    const headings = data[0].split('\t');
    data.shift();

    let newData = [];

    for (var i = 0; i < data.length; i++) {
        if (entryName != null) {
            let arr = data[i].split('\t');
            if (arr[0] != entryName) {
                newData.push(arr);
            }
        } else {
            newData.push(arr)
        }
    }

    let tsv = headings.join('\t');
    tsv+='\n';
    for (var i = 0; i < newData.length; i++) {
        tsv += newData[i].join('\t') + '\n';
    }

    const response = await fetch('https://mattvandenberg.com/workspace/csv/' + fileName, {
        method: 'PUT',
        //mode: "same-origin",
        headers: {
            'Content-Type': 'text/tab-separated-values',
        },
        body: encodeURIComponent(tsv)
    })
    const resData = await response.json();
    console.log(resData);
    

}


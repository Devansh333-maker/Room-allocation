document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const groupFile = document.getElementById('groupFile').files[0];
    const hostelFile = document.getElementById('hostelFile').files[0];

    if (groupFile && hostelFile) {
        const reader1 = new FileReader();
        const reader2 = new FileReader();

        reader1.onload = function (e) {
            const groupData = parseCSV(e.target.result);
            reader2.onload = function (e) {
                const hostelData = parseCSV(e.target.result);
                const allocation = allocateRooms(groupData, hostelData);
                displayAllocation(allocation);
            };
            reader2.readAsText(hostelFile);
        };
        reader1.readAsText(groupFile);
    }
});

function parseCSV(data) {
    const lines = data.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j].trim();
        }
        result.push(obj);
    }
    return result;
}

function allocateRooms(groupData, hostelData) {
    const allocation = [];

    groupData.forEach(group => {
        const groupId = group['Group ID'];
        const members = parseInt(group['Members']);
        const gender = group['Gender'];

        const availableRooms = hostelData.filter(hostel => hostel['Gender'] === gender && parseInt(hostel['Capacity']) >= members);

        if (availableRooms.length > 0) {
            const room = availableRooms[0];
            room['Capacity'] -= members;
            allocation.push({
                'Group ID': groupId,
                'Hostel Name': room['Hostel Name'],
                'Room Number': room['Room Number'],
                'Members Allocated': members
            });
        } else {
            allocation.push({
                'Group ID': groupId,
                'Hostel Name': 'No Room Available',
                'Room Number': 'N/A',
                'Members Allocated': members
            });
        }
    });

    return allocation;
}

function displayAllocation(allocation) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    ['Group ID', 'Hostel Name', 'Room Number', 'Members Allocated'].forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });

    table.appendChild(headerRow);

    allocation.forEach(rowData => {
        const row = document.createElement('tr');
        Object.values(rowData).forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    output.appendChild(table);
}
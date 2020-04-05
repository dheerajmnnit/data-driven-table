/**
 * @param  {"method":"GET"}} "https
 * Author: dheerajprajapati0792@gmail.com
 * Fetched the data from api 'https://restcountries.eu/rest/v2/all' and shown in the table. Added pagination, searching and sorting.
 */


// Defined variables
let sortdirection = false;
let personData;
let end = 10; let limit = 10; let page = 0;
let start = 0;

//Fetching The data from api
fetch("https://restcountries.eu/rest/v2/all", {
    "method": "GET"
}).then(response => response.json().then(data => {
    personData = data;
    loadTableData(data);
})).catch(err => {
    console.log(err);
});

function loadTableData(tableData) {
    const tableBody = document.getElementById('table-data');
    const pageNumber = document.getElementById('page-number');
    const entries = document.getElementById('entries');
    let dataHtml = '';
    for (let i = start; i < end; i++) {
        if (tableData[i])
            dataHtml += `<tr>
            <td>${i + 1}</td>
            <td> ${tableData[i].name}</td> 
            <td> ${tableData[i].capital}</td> 
            <td> ${tableData[i].region}</td> 
            <td> ${tableData[i].subregion}</td> 
            <td> ${tableData[i].population}</td> 
            <tr>`
    }
    tableBody.innerHTML = dataHtml;
    pageNumber.innerHTML = page + 1;
    entries.innerHTML = `Showing ${start + 1} to ${end} of ${tableData.length} entries.`

    setPaginationButton();
}

/* ************** Methods for sort Starts here ************ */

/**
 * This Method help us sort column using its data type
*/

function sortColumn(columnName) {
    const dataType = typeof personData[0][columnName];
    sortdirection = !sortdirection;

    switch (dataType) {
        case 'number':
            sortNumberColumn(sortdirection, columnName); break;
        case 'string':
            sortStringColumn(sortdirection, columnName); break;
    }

    loadTableData(personData);

}
function sortNumberColumn(sort, columnName) {
    const numberHeader = document.getElementById(columnName);
    numberHeader.innerHTML = `${columnName} ${sort ? "&#8593" : "&#8595;"}`
    personData = personData.sort((p1, p2) => {

        return sort ? p1[columnName] - p2[columnName] : p2[columnName] - p1[columnName]
    })
}
function sortStringColumn(sort, columnName) {
    const countryHeader = document.getElementById(columnName);
    countryHeader.innerHTML = `${columnName} ${!sort ? "&#8593" : "&#8595;"}`;
    personData = personData.sort((p1, p2) => {
        return sort ? (p1[columnName] > p2[columnName] ? -1 : 1) : (p1[columnName] < p2[columnName] ? -1 : 1)
    });
}
/* ************** Methods for sort Ends here ************ */


/* Pagination Methods starts here */

/* To Enable/Disable pagination buttons */
function setPaginationButton() {
    if (page === 0) {
        document.getElementById('prev').disabled = true;
    } else {
        document.getElementById('prev').disabled = false;
    }

    if (end === personData.length) {
        document.getElementById('next').disabled = true;
    } else {
        document.getElementById('next').disabled = false;
    }
}

function showNext() {
    page = page + 1;
    start = start + limit;
    end = end + limit;
    loadTableData(personData);
}

function showPrev() {
    page = page - 1;
    start = start - limit;
    end = end - limit;
    loadTableData(personData);
}
/* Pagination Methods ends here */



/* ************** Methods for search ************ */
/**
 *  This method help us to search column
 */
function searchColumn(columnName) {
    const dataType = typeof personData[0][columnName];
    let filterData = [];
    switch (dataType) {

        case 'number':
            filterData = searchNumberColumn(columnName); break;
        case 'string':
            filterData = searchStringColumn(columnName); break;
    }
    loadTableData(filterData);
}

function searchNumberColumn(columnName) {

    let str = document.getElementById(`${columnName}-search`).value;
    let filterData = personData.filter((item) => {
        if (item[columnName]) {
            return item[columnName] == str;
        }
    });
    return filterData;

}

function searchStringColumn(columnName) {

    let str = document.getElementById(`${columnName}-search`).value;
    let filterData = personData.filter((item) => {
        if (item[columnName]) {
            return item[columnName].includes(str);
        }
    })

    return filterData;

}
/* ************** Methods for search Ends here************ */

/* This will set data to initial state */
function reset() {
    end = 10; limit = 10; page = 0;
    start = 0;
    loadTableData(personData);
}

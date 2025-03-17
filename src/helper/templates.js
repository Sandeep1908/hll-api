import { format } from 'date-fns';

export const getHTMLReport = (branches) => `
  <html>
  <style>
   body {
      padding: 2rem;
      font-family: Arial, sans-serif;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 0.5rem;
      text-align: left;
      border: 1px solid #ddd;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

</style>
  <body>
   <title>Report for ${format(new Date(), 'dd/mm/yyyy')}</title>
   <h1>Jaiguru Branch-wise FrontDesk Report - ${format(new Date(), 'dd/mm/yyyy')}</h1>
   <table>
     <tr>
       <th> Branch </th>
       <th> Branch Manager </th>
       <th> Headcount </th>
       <th> Purchases </th>
       <th> Non-Purchases </th>
       <th> Gold </th>
       <th> Silver </th>
       <th> Diamond </th>
     </tr>
     ${branches.map((branch) => `<tr>
            <td>${branch.name}</td>
            <td>${branch.manager_name}</td>
            <td>${branch.totalCount}</td>
            <td>${branch.totalPurchased}</td>
            <td>${branch.totalNotPurchased}</td>
            <td>${branch.gold}</td>
            <td>${branch.silver}</td>
            <td>${branch.diamond}</td>
        </tr>`)}
   </table>
   </body>
 </html>

`.replaceAll(',', '');

export const getHTMLReportForOneBranch = (branchName, date, totalHC, totalP, totalNP, dailyHeadcounts) => {
  return `
  <html>
<style>
    body {
        padding: 2rem;
        font-family: Arial sans-serif;
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th td {
        padding: 0.5rem;
        text-align: left;
        border: 1px solid #ddd;
    }

    th {
        background-color: #f5f5f5;
        font-weight: bold;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    .report-div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding-bottom: 2rem;
        width: 100%;
        gap: 3rem;
    }

    .report-item {
        padding: 1rem;
        border-radius: 18px;
        width: 100%;
        display: flex;
        gap: 0.2rem;
        flex-direction: column;
        background-color: whitesmoke;
        align-items: center;
    }
    .number {
        font-size: large;
        margin: 0;
    }
</style>
<body>
<title>Report for ${date}</title>
<center>
  <img src='https://sandiyafoundations.s3.amazonaws.com/images/Jai-Guru-Jewellers/jaiguru_logo.png' />
</center>
<h1> FrontDesk Report for ${branchName} - ${date}</h1>

<div class='report-div'>
  <div class='report-item'>
    <h4>Total Headcount</h4>
    <h4 class='number'>${totalHC}</h4>
  </div>
  <div class='report-item'>
    <h4>Total Purchased</h4>
    <h4 class='number'>${totalP}</h4>
  </div>
  <div class='report-item'>
    <h4>Total Not Purchased</h4>
    <h4 class='number'>${totalNP}</h4>
  </div>
</div>

<table>
     <tr>
       <th> Salesman </th>
       <th> Name </th>
       <th> Mobile </th>
       <th> Headcount </th>
       <th> Metal Type </th>
       <th> Product Type </th>
       <th> Purchased </th>
     </tr>
     ${dailyHeadcounts?.length ? getHeadCountTableBody(dailyHeadcounts): 'No data for selected dates'}
    
   </table>


</body>
</html>

  
  `.replaceAll(',', '')
}


const getHeadCountTableBody = (dailyHeadcount) => `
 ${dailyHeadcount.map((hc) => `<tr>
            <td>${hc.salesman}</td>
            <td>${hc.name}</td>
            <td>${hc.mobile}</td>
            <td>${hc.count}</td>
            <td>${hc.metal_type}</td>
            <td>${hc.product_type}</td>
            <td>${hc.is_purchased ? 'Yes': 'No'}</td>
        </tr>`.replaceAll(',', ''))}
        
  `

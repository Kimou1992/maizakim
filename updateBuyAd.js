document.addEventListener('DOMContentLoaded', () => {
  // إرسال البيانات لتحديث Buy Ad باستخدام POST
  document.getElementById('update-buyad-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const data = {
      id: document.getElementById('id-update').value,
      buyAd: document.getElementById('buyAd-update').value,
    };

    const response = await fetch('https://maizakim.onrender.com/update-buyad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      alert('Buy Ad updated successfully!');
      fetchData(); // إعادة تحميل البيانات بعد التحديث
    } else {
      alert('Error: ' + result.error);
    }
  });
});

// جلب البيانات عند تحميل الصفحة
async function fetchData() {
  const response = await fetch('https://maizakim.onrender.com/row');
  const data = await response.json();
  
  const tableBody = document.querySelector('#data-table tbody');
  tableBody.innerHTML = ''; // مسح الجدول الحالي

  data.data.forEach(row => {
    const rowElement = document.createElement('tr');
    row.forEach(cell => {
      const cellElement = document.createElement('td');
      cellElement.textContent = cell;
      rowElement.appendChild(cellElement);
    });
    tableBody.appendChild(rowElement);
  });
}

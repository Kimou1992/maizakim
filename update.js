// وظيفة لإرسال البيانات باستخدام POST لتحديث البيانات في Google Sheets بناءً على id
async function updateDataById(event) {
  event.preventDefault();

  const data = {
    id: document.getElementById('id').value,
    sellAd: document.getElementById('sellAd').value,
    buyAd: document.getElementById('buyAd').value,
    withAd: document.getElementById('withAd').value,
    lstUpdt: document.getElementById('lstUpdt').value,
  };

  // التأكد من أن البيانات تحتوي على id
  if (!data.id) {
    alert('Please enter a valid ID!');
    return;
  }

  try {
    const response = await fetch('https://maizakim.onrender.com/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Data updated successfully!');
      // يمكنك هنا تنفيذ دالة أخرى لعرض البيانات المحدثة
      // fetchData(); // إعادة تحميل البيانات إذا لزم الأمر
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// إضافة مستمع الحدث للنموذج
document.getElementById('update-form').addEventListener('submit', updateDataById);

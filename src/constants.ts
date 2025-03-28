function getStatusT(status: string, qty?: string): {status: string, message: string} {
  console.log("Received Status Code:", status);
  switch (status) {
    case '01': return {
      status: '01',
      message: 'ขาดการเชื่อมต่อจากเซิร์ฟเวอร์'
    };
    case '02': return {
      status: '02',
      message: 'ชุดคำสั่งไม่ถูกต้อง'
    };
    case '03': return {
      status: '03',
      message: 'Checksum ในชุดคำสั่งไม่ถูกต้อง (Sxx)'
    };
    case '04': return {
      status: '04',
      message: 'คาร์ทีเซียนแกนนอนไม่เข้าตำแหน่ง'
    };
    case '05': return {
      status: '05',
      message: 'คาร์ทีเซียนแกนตั่งไม่เข้าตำแหน่ง'
    };
    case '06': return {
      status: '06',
      message: 'กลไกหยิบขาไม่เข้าตำแหน่ง'
    };
    case '07': return {
      status: '07',
      message: 'คาร์ทีเซียนแกนนอนไม่เคลื่อนที่ไปยังโมดูล'
    };
    case '08': return {
      status: '08',
      message: 'คาร์ทีเซียนแกนตั่งไม่เคลื่อนที่ไปยังโมดูล'
    };
    case '91': return {
      status: '91',
      message: 'ได้รับคำสั่งแล้ว'
    };
    case '92': return {
      status: '92',
      message: `จ่ายยาสำเร็จ และแสดงยาที่จัดได้ใน Q${qty}`
    };
    default: return {
      status: '00',
      message: 'T00'
    };
  }
}

export { getStatusT }
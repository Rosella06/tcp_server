function getStatusT(status: string, qty?: string): {status: string, message: string} {
  console.log("Received Status Code:", status);
  switch (status) {
    case '01': return {
      status: '01',
      message: 'ได้รับคำสั่งแล้ว'
    };
    case '02': return {
      status: '02',
      message: 'จ่ายยาสำเร็จ ครบตำมจำนวน'
    };
    case '03': return {
      status: '03',
      message: `จ่ายยาสำเร็จ แต่ไม่ครบตำมจำนวน Q${qty}`
    };
    case '80': return {
      status: '80',
      message: 'ผิดพลาด เนื่องจากตัวควบคุมหลักไม่พร้อมใช้งาน'
    };
    case '81': return {
      status: '81',
      message: 'ผิดพลาด เนื่องจากตัวควบคุมกลไกไม่พร้อมใช้งาน'
    };
    case '82': return {
      status: '82',
      message: 'ผิดพลาด เนื่องจากสถานะตู้ไม่พร้อมใช้งาน'
    };
    case '83': return {
      status: '83',
      message: 'ผิดพลาด เนื่องจากพารามิเตอร์ไม่สอดคล้องกับฮาร์ดแวร์'
    };
    case '90': return {
      status: '90',
      message: 'การทำงานของตัวควบคุมหลักล้มเหลว'
    };
    case '91': return {
      status: '91',
      message: 'การทำงานของตัวควบคุมกลไกล้มเหลว'
    };
    case '92': return {
      status: '92',
      message: 'สถานะของตู้ล้มเหลว'
    };
    default: return {
      status: '00',
      message: 'T00'
    };
  }
}

export { getStatusT }
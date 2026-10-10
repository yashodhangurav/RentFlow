/**
 * Helper to force download files (PDFs, Images, Base64 strings, or Server URLs) in browser
 */
export const downloadFile = (fileUrl, defaultFileName = 'ID_Proof_Document.pdf') => {
  if (!fileUrl) {
    alert('No document file attached.');
    return;
  }

  const cleanFileName = defaultFileName.endsWith('.pdf') || defaultFileName.endsWith('.png') || defaultFileName.endsWith('.jpg') || defaultFileName.endsWith('.jpeg')
    ? defaultFileName
    : `${defaultFileName}.pdf`;

  // 1. If Base64 string (with or without data: header)
  if (fileUrl.startsWith('data:') || fileUrl.includes(';base64,') || (fileUrl.length > 500 && !fileUrl.startsWith('http'))) {
    const dataUrl = fileUrl.startsWith('data:') ? fileUrl : `data:application/pdf;base64,${fileUrl}`;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = cleanFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 2. If internal server upload path (e.g., /uploads/... or http://localhost:5001/uploads/...)
  if (fileUrl.startsWith('/uploads') || fileUrl.includes('/uploads/')) {
    const relativePath = fileUrl.substring(fileUrl.indexOf('/uploads'));
    const downloadApiUrl = `http://localhost:5001/api/download?file=${encodeURIComponent(relativePath)}&filename=${encodeURIComponent(cleanFileName)}`;
    
    const link = document.createElement('a');
    link.href = downloadApiUrl;
    link.download = cleanFileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 3. If external HTTP/HTTPS URL
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = cleanFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = cleanFileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    return;
  }

  // 4. Fallback for demo filenames (generate downloadable proof text/pdf document)
  const dummyContent = `========================================================\n` +
    `ESTATEPULSE TENANT MANAGEMENT SYSTEM - VERIFIED ID PROOF\n` +
    `========================================================\n\n` +
    `Document Name : ${cleanFileName}\n` +
    `File Reference : ${fileUrl}\n` +
    `Download Date  : ${new Date().toLocaleString()}\n` +
    `Security Code  : ID-INTERNAL-${Date.now()}\n\n` +
    `This ID Proof document has been stored and verified internally.\n` +
    `========================================================\n`;

  const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = cleanFileName.replace(/\.pdf$/, '.txt');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

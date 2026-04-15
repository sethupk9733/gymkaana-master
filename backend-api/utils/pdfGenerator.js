const PDFDocument = require('pdfkit');

function renderDeclarationContent(doc, declaration, gymName) {
    // Document Header
    doc.fontSize(24).font('Helvetica-Bold').text('Legal Binding Declaration', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).text('Institutional Partnership Agreement', { align: 'center' });
    doc.moveDown(2);

    // Declaration Body
    doc.fontSize(12).font('Helvetica').text(`This document serves as a legally binding acceptance of the terms and conditions outlined for the partnership between Gymkaana and the representing partner of ${gymName}.`, { align: 'justify' });
    doc.moveDown(1.5);
    
    // The actual text from the database
    doc.fontSize(11).font('Helvetica-Oblique').text(declaration.declarationText, { align: 'justify' });
    doc.moveDown(2);

    // Details Block
    doc.fontSize(12).font('Helvetica-Bold').text('Partnership Details:');
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(11);
    doc.text(`Hub/Venue Name: ${gymName}`);
    doc.text(`Owner / Signatory: ${declaration.ownerName}`);
    doc.text(`Signature Input: ${declaration.signatureName}`);
    doc.text(`IP Address Logged: ${declaration.ipAddress || 'Not recorded'}`);
    doc.text(`Timestamp: ${new Date(declaration.timestamp).toLocaleString()}`);
    doc.text(`Declaration Accepted: ${declaration.declarationAccepted ? 'Yes' : 'No'}`);
    
    doc.moveDown(3);

    // Signatures
    doc.moveTo(50, doc.y).lineTo(250, doc.y).stroke();
    doc.moveDown(0.5);
    doc.text('Authorized Signatory', 50, doc.y);
    doc.text(`(${declaration.signatureName})`, 50, doc.y);

    doc.moveTo(350, doc.y - 12 - 14).lineTo(550, doc.y - 12 - 14).stroke();
    doc.text('Gymkaana Operations', 350, doc.y - 12 - 14);

    // Footer
    doc.fontSize(8).font('Helvetica-Oblique').text(`Document generated securely by Gymkaana on ${new Date().toLocaleString()}`, 50, doc.page.height - 50, { align: 'center' });
}

function generateDeclarationPDF(declaration, gymName, res) {
    const doc = new PDFDocument({ margin: 50 });
    
    // Pipe the PDF directly to the response
    doc.pipe(res);
    renderDeclarationContent(doc, declaration, gymName);
    doc.moveDown(0.5);
    doc.fontSize(16).text('Institutional Partnership Agreement', { align: 'center' });
    doc.moveDown(2);

    // Declaration Body
    doc.fontSize(12).font('Helvetica').text(`This document serves as a legally binding acceptance of the terms and conditions outlined for the partnership between Gymkaana and the representing partner of ${gymName}.`, { align: 'justify' });
    doc.moveDown(1.5);
    
    // The actual text from the database
    doc.fontSize(11).font('Helvetica-Oblique').text(declaration.declarationText, { align: 'justify' });
    doc.moveDown(2);

    // Details Block
    doc.fontSize(12).font('Helvetica-Bold').text('Partnership Details:');
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(11);
    doc.text(`Hub/Venue Name: ${gymName}`);
    doc.text(`Owner / Signatory: ${declaration.ownerName}`);
    doc.text(`Signature Input: ${declaration.signatureName}`);
    doc.text(`IP Address Logged: ${declaration.ipAddress || 'Not recorded'}`);
    doc.text(`Timestamp: ${new Date(declaration.timestamp).toLocaleString()}`);
    doc.text(`Declaration Accepted: ${declaration.declarationAccepted ? 'Yes' : 'No'}`);
    
    doc.moveDown(3);

    // Signatures
    doc.moveTo(50, doc.y).lineTo(250, doc.y).stroke();
    doc.moveDown(0.5);
    doc.text('Authorized Signatory', 50, doc.y);
    doc.text(`(${declaration.signatureName})`, 50, doc.y);

    doc.moveTo(350, doc.y - 12 - 14).lineTo(550, doc.y - 12 - 14).stroke();
    doc.text('Gymkaana Operations', 350, doc.y - 12 - 14);

    // Footer
    doc.fontSize(8).font('Helvetica-Oblique').text(`Document generated securely by Gymkaana on ${new Date().toLocaleString()}`, 50, doc.page.height - 50, { align: 'center' });

    doc.end();
}

function generateDeclarationPDFBuffer(declaration, gymName) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.on('error', reject);
            
            renderDeclarationContent(doc, declaration, gymName);
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    generateDeclarationPDF,
    generateDeclarationPDFBuffer
};

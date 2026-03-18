import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, Payment, SupplierProfile } from '../types';

export const generateOrderPDF = (order: Order, supplier: SupplierProfile) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const copper: [number, number, number] = [184, 115, 51]; // #B87333
  const midnight: [number, number, number] = [10, 10, 10]; // #0A0A0A
  const gray: [number, number, number] = [128, 128, 128];

  // 1. Header: Company Info (Wender Stores)
  doc.setFillColor(midnight[0], midnight[1], midnight[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('WENDER STORES', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Avenue de la Décoration, 75001 Paris', 15, 28);
  doc.text('Tél: +33 1 00 00 00 00 | Email: contact@wenderstores.com', 15, 34);

  // Document Title
  doc.setTextColor(copper[0], copper[1], copper[2]);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  const title = 'BON DE COMMANDE';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, pageWidth - titleWidth - 15, 25);

  // 2. Order & Supplier Info
  doc.setTextColor(midnight[0], midnight[1], midnight[2]);
  doc.setFontSize(12);
  doc.setDrawColor(copper[0], copper[1], copper[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 45, pageWidth - 15, 45);

  // Order Details (Left)
  doc.setFont('helvetica', 'bold');
  doc.text('DÉTAILS COMMANDE', 15, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`N° Commande: ${order.reference}`, 15, 62);
  doc.text(`Date: ${order.date}`, 15, 68);
  doc.text(`Statut: ${order.status}`, 15, 74);

  // Supplier Details (Right)
  const rightColX = pageWidth / 2 + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FOURNISSEUR', rightColX, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(supplier.companyName, rightColX, 62);
  doc.text(supplier.address, rightColX, 68, { maxWidth: pageWidth / 2 - 25 });
  doc.text(`Tél: ${supplier.phone}`, rightColX, 80);
  doc.text(`Email: ${supplier.email}`, rightColX, 86);

  // 3. Products Table
  const tableData = order.items.map(item => [
    item.productName,
    item.productId, 
    item.quantity.toString(),
    `${item.price.toLocaleString()} €`,
    `${(item.quantity * item.price).toLocaleString()} €`
  ]);

  autoTable(doc, {
    startY: 95,
    head: [['Produit', 'Référence', 'Quantité', 'Prix Unitaire', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: midnight,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    },
    styles: {
      fontSize: 9,
      cellPadding: 4
    }
  });

  // Total General
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const totalText = `TOTAL GÉNÉRAL : ${order.totalAmount.toLocaleString()} €`;
  const totalWidth = doc.getTextWidth(totalText);
  doc.text(totalText, pageWidth - totalWidth - 15, finalY);

  // 4. Payment & Delivery Info
  let nextY = finalY + 20;
  
  // Section Title
  doc.setDrawColor(230, 230, 230);
  doc.line(15, nextY - 5, pageWidth - 15, nextY - 5);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS COMPLÉMENTAIRES', 15, nextY);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  nextY += 8;
  
  // Payment info
  doc.setFont('helvetica', 'bold');
  doc.text('Paiement:', 15, nextY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Statut: ${order.paymentStatus || 'Non payé'}`, 35, nextY);
  doc.text(`Mode: ${order.paymentMethod || 'N/A'}`, 75, nextY);
  if (order.paymentDate) {
    doc.text(`Date: ${order.paymentDate}`, 120, nextY);
  }
  
  nextY += 6;
  
  // Delivery info
  doc.setFont('helvetica', 'bold');
  doc.text('Livraison:', 15, nextY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date prévue: ${order.deliveryDate || 'À confirmer'}`, 35, nextY);
  doc.text(`Adresse: ${order.deliveryAddress || 'N/A'}`, 75, nextY, { maxWidth: pageWidth - 90 });

  // 6. Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(copper[0], copper[1], copper[2]);
  doc.line(15, footerY, pageWidth - 15, footerY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(gray[0], gray[1], gray[2]);
  const footerNote = 'Merci pour votre confiance et votre collaboration.';
  const footerNoteWidth = doc.getTextWidth(footerNote);
  doc.text(footerNote, (pageWidth - footerNoteWidth) / 2, footerY + 10);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const legal = 'Wender Stores - SAS au capital de 1 000 000 € - RCS Paris 123 456 789';
  const legalWidth = doc.getTextWidth(legal);
  doc.text(legal, (pageWidth - legalWidth) / 2, footerY + 18);

  // Save the PDF
  doc.save(`Bon_de_commande_${order.reference}.pdf`);
};

export const generateReceiptPDF = (payment: Payment, supplier: SupplierProfile) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const copper: [number, number, number] = [184, 115, 51]; // #B87333
  const midnight: [number, number, number] = [10, 10, 10]; // #0A0A0A
  const gray: [number, number, number] = [128, 128, 128];

  // 1. Header: Company Info (Wender Stores)
  doc.setFillColor(midnight[0], midnight[1], midnight[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('WENDER STORES', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Avenue de la Décoration, 75001 Paris', 15, 28);
  doc.text('Tél: +33 1 00 00 00 00 | Email: contact@wenderstores.com', 15, 34);

  // Document Title
  doc.setTextColor(copper[0], copper[1], copper[2]);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const title = 'RÉCÉPISSÉ DE PAIEMENT';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, pageWidth - titleWidth - 15, 25);

  // 2. Payment & Client Info
  doc.setTextColor(midnight[0], midnight[1], midnight[2]);
  doc.setFontSize(12);
  doc.setDrawColor(copper[0], copper[1], copper[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 45, pageWidth - 15, 45);

  // Payment Details (Left)
  doc.setFont('helvetica', 'bold');
  doc.text('DÉTAILS DU PAIEMENT', 15, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Référence: ${payment.reference}`, 15, 62);
  doc.text(`Date: ${payment.date}`, 15, 68);
  doc.text(`Commande liée: ${payment.orderReference}`, 15, 74);
  doc.text(`Mode de paiement: ${payment.paymentMethod || 'N/A'}`, 15, 80);

  // Client Details (Right)
  const rightColX = pageWidth / 2 + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', rightColX, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(payment.clientName, rightColX, 62);
  doc.text('Client de Wender Stores', rightColX, 68);

  // 3. Financial Summary Table
  autoTable(doc, {
    startY: 95,
    head: [['Désignation', 'Valeur']],
    body: [
      ['Référence de facture', payment.reference],
      ['Montant Total', `${payment.amount.toLocaleString()} €`],
      ['Montant Réglé', `${payment.amount.toLocaleString()} €`],
      ['Mode de Règlement', payment.paymentMethod || 'N/A'],
      ['Statut du Paiement', payment.status]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: midnight,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    }
  });

  // 4. Additional Info / Notes
  let nextY = (doc as any).lastAutoTable.finalY + 15;
  if (payment.notes) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVATIONS', 15, nextY);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(payment.notes, 15, nextY + 7, { maxWidth: pageWidth - 30 });
    nextY += 25;
  }

  // 5. Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(copper[0], copper[1], copper[2]);
  doc.line(15, footerY, pageWidth - 15, footerY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(gray[0], gray[1], gray[2]);
  const footerNote = 'Merci pour votre confiance. Ce document vaut preuve de paiement.';
  const footerNoteWidth = doc.getTextWidth(footerNote);
  doc.text(footerNote, (pageWidth - footerNoteWidth) / 2, footerY + 10);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const legal = `${supplier.companyName} - ${supplier.address}`;
  const legalWidth = doc.getTextWidth(legal);
  doc.text(legal, (pageWidth - legalWidth) / 2, footerY + 18);

  // Save the PDF
  doc.save(`recepisse_${payment.reference}.pdf`);
};

export const generateContractPDF = (supplier: SupplierProfile) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors
  const copper: [number, number, number] = [184, 115, 51]; // #B87333
  const midnight: [number, number, number] = [10, 10, 10]; // #0A0A0A
  const gray: [number, number, number] = [128, 128, 128];

  // 1. Header: Company Info (Wender Stores)
  doc.setFillColor(midnight[0], midnight[1], midnight[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('WENDER STORES', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Avenue de la Décoration, 75001 Paris', 15, 28);
  doc.text('Tél: +33 1 00 00 00 00 | Email: contact@wenderstores.com', 15, 34);

  // Document Title
  doc.setTextColor(copper[0], copper[1], copper[2]);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const title = 'CONDITIONS GÉNÉRALES FOURNISSEUR';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, pageWidth - titleWidth - 15, 25);

  // 2. Supplier Info
  doc.setTextColor(midnight[0], midnight[1], midnight[2]);
  doc.setFontSize(12);
  doc.setDrawColor(copper[0], copper[1], copper[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 45, pageWidth - 15, 45);

  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS FOURNISSEUR', 15, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Entreprise: ${supplier.companyName}`, 15, 62);
  doc.text(`Contact: ${supplier.contactName}`, 15, 68);
  doc.text(`Adresse: ${supplier.address}`, 15, 74, { maxWidth: pageWidth - 30 });
  doc.text(`Email: ${supplier.email}`, 15, 86);

  // 3. Contract Content
  let currentY = 100;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Engagement tarifaire', 15, currentY);
  currentY += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Le fournisseur s’engage à respecter les tarifs définis dans le catalogue. Toute modification doit être soumise à validation préalable par Wender Stores.', 15, currentY, { maxWidth: pageWidth - 30 });
  currentY += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Gestion des produits et du stock', 15, currentY);
  currentY += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Le fournisseur est responsable de la mise à jour de la disponibilité. Un produit en rupture sera automatiquement désactivé.', 15, currentY, { maxWidth: pageWidth - 30 });
  currentY += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Responsabilité sur les commandes', 15, currentY);
  currentY += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Le fournisseur s’engage à honorer toutes les commandes reçues et à respecter les spécifications des produits.', 15, currentY, { maxWidth: pageWidth - 30 });
  currentY += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Délais de livraison', 15, currentY);
  currentY += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Le fournisseur doit respecter les délais convenus. Tout retard doit être justifié et signalé immédiatement.', 15, currentY, { maxWidth: pageWidth - 30 });
  currentY += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('5. Modification du contrat', 15, currentY);
  currentY += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Une fois validé, le contrat ne peut être modifié par le fournisseur sans une procédure officielle validée par Wender Stores.', 15, currentY, { maxWidth: pageWidth - 30 });

  // 4. Signature Section
  const signatureY = pageHeight - 60;
  doc.setDrawColor(copper[0], copper[1], copper[2]);
  doc.line(15, signatureY, pageWidth - 15, signatureY);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SIGNATURE ÉLECTRONIQUE', 15, signatureY + 10);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Signé par: ${supplier.contractSignedBy || supplier.contactName}`, 15, signatureY + 18);
  doc.text(`Date de signature: ${supplier.contractSignedDate || new Date().toLocaleDateString()}`, 15, signatureY + 24);
  
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(copper[0], copper[1], copper[2]);
  doc.text('MENTION : "LU ET APPROUVÉ"', 15, signatureY + 32);

  // 5. Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(gray[0], gray[1], gray[2]);
  const legal = 'Wender Stores - SAS au capital de 1 000 000 € - RCS Paris 123 456 789';
  const legalWidth = doc.getTextWidth(legal);
  doc.text(legal, (pageWidth - legalWidth) / 2, pageHeight - 10);

  // Save the PDF
  const fileName = `contrat_fournisseur_${supplier.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

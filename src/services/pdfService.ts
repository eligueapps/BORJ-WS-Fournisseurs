import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as QRCode from 'qrcode';
import { Order, Payment, SupplierProfile } from '../types';

export const generateOrderPDF = async (order: Order, supplier: SupplierProfile) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors
  const copper: [number, number, number] = [184, 115, 51]; // #B87333
  const midnight: [number, number, number] = [10, 10, 10]; // #0A0A0A
  const gray: [number, number, number] = [128, 128, 128];

  // 1. Header Section
  doc.setDrawColor(0);
  doc.setLineWidth(0.1);
  
  // Company Box (Left)
  doc.rect(10, 10, 90, 20);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(midnight[0], midnight[1], midnight[2]);
  doc.text('WENDER STORES', 15, 22);

  // Info Box (Right)
  doc.rect(110, 10, 90, 20);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Edité le : ${new Date().toLocaleDateString('fr-FR')}`, 115, 18);
  doc.text('Page : 1 / 1', 115, 25);

  // 2. Title Section
  // Title Box
  doc.rect(10, 35, 120, 15);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Bon de commande', 15, 45);

  // Ref/Date Box
  doc.rect(135, 35, 65, 15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° : ${order.reference}`, 140, 41);
  doc.text(`Date : ${order.date}`, 140, 47);

  // 3. Details Section
  // Order Details Box (Left)
  doc.rect(10, 55, 90, 35);
  doc.setFillColor(240, 240, 240);
  doc.rect(10, 55, 90, 8, 'F');
  doc.rect(10, 55, 90, 8);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DÉTAILS COMMANDE', 15, 60);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`N° Commande : ${order.reference}`, 15, 70);
  doc.text(`Date : ${order.date}`, 15, 77);
  doc.text(`Statut : ${order.status}`, 15, 84);

  // Supplier Box (Right)
  doc.rect(110, 55, 90, 35);
  doc.setFillColor(240, 240, 240);
  doc.rect(110, 55, 90, 8, 'F');
  doc.rect(110, 55, 90, 8);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FOURNISSEUR', 115, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(supplier.companyName, 115, 70);
  doc.text(supplier.address, 115, 77, { maxWidth: 80 });
  doc.text(`Tél : ${supplier.phone}`, 115, 84);

  // 4. Products Table
  const tableData = order.items.map(item => [
    item.productId,
    item.productName,
    '', // Largeur (not in data)
    '', // Hauteur (not in data)
    item.quantity.toString(),
    `${item.price.toLocaleString()} DH`,
    `${(item.quantity * item.price).toLocaleString()} DH`
  ]);

  autoTable(doc, {
    startY: 95,
    head: [['Référence', 'Désignation', 'Largeur', 'Hauteur', 'Quantité', 'Prix unitaire', 'Montant']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'right' },
      6: { halign: 'right' }
    },
    styles: {
      fontSize: 8,
      cellPadding: 3
    }
  });

  // Total General
  const finalY = (doc as any).lastAutoTable.finalY + 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const totalText = `TOTAL GÉNÉRAL : ${order.totalAmount.toLocaleString()} DH`;
  const totalWidth = doc.getTextWidth(totalText);
  doc.text(totalText, pageWidth - totalWidth - 10, finalY + 5);

  // 5. Additional Info
  let nextY = finalY + 20;
  doc.rect(10, nextY, pageWidth - 20, 30);
  doc.setFillColor(240, 240, 240);
  doc.rect(10, nextY, pageWidth - 20, 8, 'F');
  doc.rect(10, nextY, pageWidth - 20, 8);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS COMPLÉMENTAIRES', 15, nextY + 5);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  nextY += 15;
  doc.text(`Paiement : Statut : ${order.paymentStatus || 'En attente'} | Mode : ${order.paymentMethod || 'Virement Bancaire'}`, 15, nextY);
  nextY += 7;
  doc.text(`Livraison : Date prévue : ${order.deliveryDate || 'À confirmer'} | Adresse : ${order.deliveryAddress || 'N/A'}`, 15, nextY, { maxWidth: pageWidth - 30 });

  // 6. QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(order.reference);
    const qrSize = 30;
    doc.addImage(qrDataUrl, 'PNG', pageWidth - qrSize - 10, pageHeight - qrSize - 20, qrSize, qrSize);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text('QR Code (Numéro de bon de commande)', pageWidth - qrSize - 10, pageHeight - 15);
  } catch (err) {
    console.error('Error generating QR code:', err);
  }

  // 7. Footer
  const footerY = pageHeight - 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(gray[0], gray[1], gray[2]);
  const legal = 'Wender Stores - SAS au capital de 1 000 000 DH - RCS Paris 123 456 789';
  const legalWidth = doc.getTextWidth(legal);
  doc.text(legal, (pageWidth - legalWidth) / 2, footerY);

  // Save the PDF
  doc.save(`Bon_de_commande_${order.reference}.pdf`);
};

export const generateOrdersReportPDF = (orders: Order[], supplier: SupplierProfile, startDate: string, endDate: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const copper: [number, number, number] = [184, 115, 51];
  const midnight: [number, number, number] = [10, 10, 10];

  // Header
  doc.setFillColor(midnight[0], midnight[1], midnight[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT DES COMMANDES', 15, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Période : du ${startDate} au ${endDate}`, 15, 30);
  doc.text(`Fournisseur : ${supplier.companyName}`, pageWidth - 15, 30, { align: 'right' });

  const tableData = orders.map(order => [
    order.reference,
    order.date,
    order.clientName,
    order.status,
    order.consultationStatus || 'Non consultée',
    `${order.totalAmount.toLocaleString()} DH`
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Référence', 'Date', 'Client', 'Statut', 'Réception', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: midnight, textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
    columnStyles: { 5: { halign: 'right' } }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL GÉNÉRAL : ${totalAmount.toLocaleString()} DH`, pageWidth - 15, finalY, { align: 'right' });

  doc.save(`Rapport_Commandes_${startDate}_${endDate}.pdf`);
};

export const generatePaymentsReportPDF = (payments: Payment[], supplier: SupplierProfile, startDate: string, endDate: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const midnight: [number, number, number] = [10, 10, 10];

  doc.setFillColor(midnight[0], midnight[1], midnight[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT DES PAIEMENTS', 15, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Période : du ${startDate} au ${endDate}`, 15, 30);
  doc.text(`Fournisseur : ${supplier.companyName}`, pageWidth - 15, 30, { align: 'right' });

  const tableData = payments.map(payment => [
    payment.reference,
    payment.date,
    payment.orderReference,
    payment.clientName,
    payment.paymentMethod || 'N/A',
    payment.status,
    `${payment.amount.toLocaleString()} DH`
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Réf. Paiement', 'Date', 'Réf. Commande', 'Client', 'Mode', 'Statut', 'Montant']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: midnight, textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
    columnStyles: { 6: { halign: 'right' } }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL GÉNÉRAL : ${totalAmount.toLocaleString()} DH`, pageWidth - 15, finalY, { align: 'right' });

  doc.save(`Rapport_Paiements_${startDate}_${endDate}.pdf`);
};

export const generateDetailedReportPDF = (orders: Order[], payments: Payment[], supplier: SupplierProfile, startDate: string, endDate: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const midnight: [number, number, number] = [10, 10, 10];

  doc.setFillColor(midnight[0], midnight[1], midnight[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT DÉTAILLÉ D\'ACTIVITÉ', 15, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Période : du ${startDate} au ${endDate}`, 15, 30);
  doc.text(`Fournisseur : ${supplier.companyName}`, pageWidth - 15, 30, { align: 'right' });

  // Summary Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RÉSUMÉ ANALYTIQUE', 15, 55);
  
  const totalOrders = orders.length;
  const totalOrdersAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPayments = payments.length;
  const totalPaymentsAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre total de commandes : ${totalOrders}`, 15, 65);
  doc.text(`Chiffre d'affaires total : ${totalOrdersAmount.toLocaleString()} DH`, 15, 72);
  doc.text(`Nombre total de paiements reçus : ${totalPayments}`, 15, 79);
  doc.text(`Montant total encaissé : ${totalPaymentsAmount.toLocaleString()} DH`, 15, 86);

  // Orders Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LISTE DES COMMANDES', 15, 100);
  
  autoTable(doc, {
    startY: 105,
    head: [['Référence', 'Date', 'Client', 'Statut', 'Total']],
    body: orders.map(o => [o.reference, o.date, o.clientName, o.status, `${o.totalAmount.toLocaleString()} DH`]),
    theme: 'grid',
    headStyles: { fillColor: midnight, textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
    columnStyles: { 4: { halign: 'right' } }
  });

  // Payments Table
  let nextY = (doc as any).lastAutoTable.finalY + 15;
  if (nextY > 250) {
    doc.addPage();
    nextY = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LISTE DES PAIEMENTS', 15, nextY);
  
  autoTable(doc, {
    startY: nextY + 5,
    head: [['Référence', 'Date', 'Commande', 'Mode', 'Montant']],
    body: payments.map(p => [p.reference, p.date, p.orderReference, p.paymentMethod || 'N/A', `${p.amount.toLocaleString()} DH`]),
    theme: 'grid',
    headStyles: { fillColor: midnight, textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
    columnStyles: { 4: { halign: 'right' } }
  });

  doc.save(`Rapport_Detaille_${startDate}_${endDate}.pdf`);
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
      ['Montant Total', `${payment.amount.toLocaleString()} DH`],
      ['Montant Réglé', `${payment.amount.toLocaleString()} DH`],
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
  const legal = 'Wender Stores - SAS au capital de 1 000 000 DH - RCS Paris 123 456 789';
  const legalWidth = doc.getTextWidth(legal);
  doc.text(legal, (pageWidth - legalWidth) / 2, pageHeight - 10);

  // Save the PDF
  const fileName = `contrat_fournisseur_${supplier.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

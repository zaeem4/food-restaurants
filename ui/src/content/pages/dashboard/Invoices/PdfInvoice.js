import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const PdfInvoice = ({ invoiceData }) => {
  console.log(invoiceData);
  const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    header: {
      textAlign: "right",
      marginBottom: 10,
    },
    section: {
      marginBottom: 10,
      marginTop: 10,
    },
    table: {
      marginTop: 10,
    },
    tableHeader: {
      backgroundColor: "#f2f2f2",
      fontWeight: "bold",
      padding: 6,
      fontSize: 12,
      textAlign: "center",
    },
    tableCell: {
      padding: 6,
      fontSize: 12,
      textAlign: "center",
    },
  });

  return (
    <PDFViewer width="100%" height="600px">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>Invoice</Text>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              Racun# INV-{invoiceData.id}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
              Balance Due
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              EUR {invoiceData.fee}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>Bill To:</Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {invoiceData.user_name}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={{ fontSize: 15 }}>{invoiceData.owner}</Text>
            <Text style={{ fontSize: 15 }}>{invoiceData.address}</Text>
            <Text style={{ fontSize: 15 }}>{invoiceData.city}</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.table}>
              <View
                style={{ flexDirection: "row", backgroundColor: "#f2f2f2" }}
              >
                <Text style={[styles.tableHeader, { flex: 1 }]}>#</Text>
                <Text style={[styles.tableHeader, { flex: 1 }]}>Type</Text>
                <Text style={[styles.tableHeader, { flex: 1 }]}>Fee Value</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.tableCell, { flex: 1 }]}>1</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {invoiceData.fee_type}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {invoiceData.fee_value}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PdfInvoice;

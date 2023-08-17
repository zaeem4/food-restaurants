import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const PdfInvoice = ({ data }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    header: {
      textAlign: "center",
      marginBottom: 10,
    },
    section: {
      marginBottom: 10,
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
    <PDFViewer width="100%" height="800px">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={{ fontSize: 18 }}>Invoice</Text>
          </View>
          <View style={styles.section}>
            <Text>Bill To:</Text>
            <Text>Restaurant ID: {data.restaurant_id}</Text>
            {/* <Text>Address: 123 Main St</Text>
            <Text>City: Anytown</Text> */}
          </View>
          <View style={styles.section}>
            <Text>Invoice Details:</Text>
            <Text>Date: {new Date(data.create_at).toDateString}</Text>
            <Text>Invoice Number: {data.id}</Text>
          </View>
          {/* <View style={styles.section}>
            <Text>Items:</Text>
            <View style={styles.table}>
              <View
                style={{ flexDirection: "row", backgroundColor: "#f2f2f2" }}
              >
                <Text style={[styles.tableHeader, { flex: 2 }]}>Item</Text>
                <Text style={[styles.tableHeader, { flex: 1 }]}>Quantity</Text>
                <Text style={[styles.tableHeader, { flex: 1 }]}>Price</Text>
                <Text style={[styles.tableHeader, { flex: 1 }]}>Total</Text>
              </View>
            </View>
          </View> */}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PdfInvoice;

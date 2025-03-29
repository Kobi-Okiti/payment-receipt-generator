import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type ReceiptProps = {
    receipt: {
      transactionId: string;
      accountNumber: string;
      bank: string;
      accountName: string;
      amount: string;
      timestamp: string;
    };
  };

// Define styles for the PDF
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
    header: { textAlign: "center", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
    section: { marginBottom: 15, flexDirection: "row", justifyContent: "space-between" },
    label: { fontWeight: "bold" },
    paidStamp: { width: 100, height: 50, marginTop: 20, alignSelf: "center" },
    footer: { marginTop: 20, textAlign: "center", fontSize: 10, color: "gray" }
});

const PAID_STAMP_URL = "@/public/images/8234.jpg";

// PDF Component
const ReceiptPDF: React.FC<ReceiptProps> = ({ receipt }) => (
    <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <Text style={styles.header}>Payment Receipt</Text>

                {/* Transaction Details */}
                <View style={styles.section}>
                    <Text style={styles.label}>Transaction ID:</Text>
                    <Text>{receipt.transactionId}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Account Number:</Text>
                    <Text>{receipt.accountNumber}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Bank:</Text>
                    <Text>{receipt.bank}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Account Name:</Text>
                    <Text>{receipt.accountName}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Amount Paid:</Text>
                    <Text>N{receipt.amount}.00</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Transaction Date:</Text>
                    <Text>{receipt.timestamp}</Text>
                </View>

                {/* Paid Stamp */}
                <img src={PAID_STAMP_URL} style={styles.paidStamp} />

                {/* Footer */}
                <Text style={styles.footer}>Thank you for your payment!</Text>
            </Page>
        </Document>
);

export default ReceiptPDF;

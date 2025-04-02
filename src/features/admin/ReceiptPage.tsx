import ReceiptPDF from '@/components/receiptPdf';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Transaction {
    transactionId: string;
    amount: string; // Keeping amount as string to match your data structure.
    timestamp: string;
    accountNumber: string;
    bank: string;
    userName: string;
    email: string;
    accountName: string;
    status: string;
}

const ReceiptPage = () => {
    const { transactionID } = useParams<{ transactionID: string }>(); // Get transactionID from URL
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Retrieve transaction data from localStorage
        const storedTransactions = JSON.parse(localStorage.getItem('paymentHistory') || '[]');

        // Find the transaction by the transactionId from the URL
        const foundTransaction = storedTransactions.find(
            (t: Transaction) => t.transactionId === transactionID
        );

        if (foundTransaction) {
            // Convert `amount` to number
            foundTransaction.amount = parseFloat(foundTransaction.amount);
        }

        setTransaction(foundTransaction || null); // Set the transaction state
    }, [transactionID]); // Re-run this effect if transactionID changes

    // Show a message if the transaction is not found
    if (!transaction) {
        return <div>Transaction not found!</div>;
    }

    return (
        <div className='w-full h-screen flex items-center justify-center px-[20px]'>
            <div className="w-full md:max-w-md lg:max-w-md mx-auto p-2 md:p-6 bg-white rounded-lg shadow-lg">
                <div className="flex justify-center mb-4 w-full">
                    <div className="w-16 h-16 flex items-center justify-center bg-green-600 rounded-full animate-bounce">
                        <i className="success-icon text-white size-[35px]" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-center text-gray-800">Payment Receipt</h2>
                <p className="text-sm text-gray-500 text-center">Transaction Successful</p>

                <div className="mt-4 p-4 bg-gray-100 rounded-md text-sm flex flex-col gap-4">
                    <p className="flex justify-between">
                        <span className="font-medium">Transaction ID:</span>
                        <span className="text-gray-700">{transaction.transactionId}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Account Number:</span>
                        <span className="text-gray-700">{transaction.accountNumber}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Bank:</span>
                        <span className="text-gray-700">{transaction.bank}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Name:</span>
                        <span className="text-gray-700">{transaction.userName}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Email:</span>
                        <span className="text-gray-700">{transaction.email}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Account Name:</span>
                        <span className="text-gray-700">{transaction.accountName}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Amount Paid:</span>
                        <span className="text-green-600 font-bold">₦{transaction.amount}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Transaction Date:</span>
                        <span className="text-gray-700">{transaction.timestamp}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <span className={`text-${transaction.status === "pending" ? "yellow" : "green"}-600 font-bold`}>
                            {transaction.status}
                        </span>
                    </p>
                </div>
                <div className="mt-4 w-full flex flex-row items-center gap-[5px]">
                    <PDFDownloadLink document={<ReceiptPDF receipt={transaction} />} fileName={`Receipt_${transaction.transactionId}.pdf`} className="w-1/2">
                        {({ loading }) => (
                            <Button className="h-[50px] text-white rounded !bg-black !text-[12px] md:!text-[16px] lg:!text-[16px] w-full">
                                {loading ? "Generating PDF..." : "Download Receipt"}
                            </Button>
                        )}
                    </PDFDownloadLink>
                    <Button
                        className="h-[50px] w-1/2 text-white rounded !bg-black !text-[12px] md:!text-[16px] lg:!text-[16px]"
                        onClick={() => navigate("/admin-dashboard")}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPage;

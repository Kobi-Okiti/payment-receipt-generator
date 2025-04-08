import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReceiptPDF from "@/components/receiptPdf";
import { useNavigate } from "react-router-dom";

const banks = [
    "Access Bank",
    "GTBank",
    "Zenith Bank",
    "First Bank",
    "UBA",
    "FCMB",
    "Union Bank",
    "Sterling Bank",
    "Fidelity Bank",
    "EcoBank",
    "Polaris Bank",
    "Wema Bank",
    "Heritage Bank",
    "Jaiz Bank",
    "Keystone Bank",
    "Stanbic IBTC Bank",
    "Unity Bank",

    // ✅ Fintech Banks
    "Opay",
    "Kuda Bank",
    "PalmPay",
    "Moniepoint",
    "Rubies Bank",
    "VFD Microfinance Bank",
];

const formSchema = z.object({
    accountNumber: z.string().length(10, "Account number must be 10 digits"),
    bank: z.string().min(1, "Please select a bank"),
    accountName: z.string().min(1, "Account name is required"),
    userName: z.string().min(1, "user name is required"),
    email: z.string().email("Invalid email address"),
    amount: z.string().min(1, "Amount is required"),
});

interface FormDataType {
    accountNumber: string;
    bank: string;
    accountName: string;
    userName: string;
    email: string;
    amount: string;
    timestamp: string;
    transactionId: string;
    status: string; // Add status field
}

export default function PaymentFormPage() {
    const [accountName, setAccountName] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [receipt, setReceipt] = useState<FormDataType | null>(null);
    const [paymentHistory, setPaymentHistory] = useState<FormDataType[]>([]);

    const navigate = useNavigate();
    const isAdmin = localStorage.getItem("isAdmin") === "true";


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountNumber: "",
            bank: "",
            accountName: "",
            amount: "",
            userName: "",
            email: "",
        },
    });

    const accountNames = ["John Doe", "Mary Johnson", "David Smith", "Chinedu Okafor", "Fatima Hassan"];

    const handleAccountLookup = (accountNumber: string) => {
        if (accountNumber.length === 10) {
            const randomName = accountNames[Math.floor(Math.random() * accountNames.length)];
            setAccountName(randomName);
            form.setValue("accountName", randomName);
        }
    };


    const generateTransactionId = () => {
        return "TXN-" + Math.floor(1000000000 + Math.random() * 9000000000);
    };

    const onSubmit = (values: Omit<FormDataType, "timestamp" | "transactionId" | "status">) => {
        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);
            const newReceipt = {
                ...values,
                timestamp: new Date().toLocaleString(),
                transactionId: generateTransactionId(),
                status: "pending",
            };
            setReceipt(newReceipt);

            // Retrieve existing transactions from localStorage
            const existingTransactions = JSON.parse(localStorage.getItem("paymentHistory") || "[]");

            // Store updated transaction history
            const updatedHistory = [newReceipt, ...existingTransactions];
            localStorage.setItem("paymentHistory", JSON.stringify(updatedHistory));

            // 🔹 Update state to refresh UI without reload
            setPaymentHistory(updatedHistory);


        }, 3000);
    };

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
        setPaymentHistory(storedHistory);
    }, []);

    return (
        <>
            {isProcessing ? (
                // Success Screen with Animation
                <div className="flex flex-col items-center justify-center size-64 bg-white rounded-lg shadow-lg p-6">
                    <div className="w-16 h-16 flex items-center justify-center bg-green-600 rounded-full animate-bounce">
                        <i className="success-icon text-white size-[35px]" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-green-700">Payment Successful!</h2>
                    <p className=" mt-[10px] text-sm text-gray-500">Generating your receipt...</p>
                </div>
            ) : receipt ? (
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
                            <span className="text-gray-700">{receipt.transactionId}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Account Number:</span>
                            <span className="text-gray-700">{receipt.accountNumber}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Bank:</span>
                            <span className="text-gray-700">{receipt.bank}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Name:</span>
                            <span className="text-gray-700">{receipt.userName}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span className="text-gray-700">{receipt.email}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Account Name:</span>
                            <span className="text-gray-700">{receipt.accountName}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Amount Paid:</span>
                            <span className="text-green-600 font-bold">₦{receipt.amount}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Transaction Date:</span>
                            <span className="text-gray-700">{receipt.timestamp}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-medium">Status:</span>
                            <span className={`text-${receipt.status === "pending" ? "yellow" : "green"}-600 font-bold`}>
                                {receipt.status}
                            </span>
                        </p>
                    </div>
                    <div className="mt-4 w-full flex flex-row items-center gap-[5px]">
                        <PDFDownloadLink document={<ReceiptPDF receipt={receipt} />} fileName={`Receipt_${receipt.transactionId}.pdf`} className="w-1/2">
                            {({ loading }) => (
                                <Button className="h-[50px] text-white rounded !bg-black !text-[12px] md:!text-[16px] lg:!text-[16px] w-full">
                                    {loading ? "Generating PDF..." : "Download Receipt"}
                                </Button>
                            )}
                        </PDFDownloadLink>
                        <Button
                            className="h-[50px] w-1/2 text-white rounded !bg-black !text-[12px] md:!text-[16px] lg:!text-[16px]"
                            onClick={() => {
                                setReceipt(null);  // Clear receipt
                                setAccountName(""); // Reset account name
                                form.reset();       // Reset form fields
                            }}
                        >
                            Make Another Payment
                        </Button>
                    </div>

                </div>
            ) : (
                <div className="w-full md:max-w-md lg:max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Make a Payment</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Account Number */}
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Number</FormLabel>
                                        <Input
                                            {...field}
                                            placeholder="Enter 10-digit account number"
                                            maxLength={10}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleAccountLookup(e.target.value);
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Bank Name */}
                            <FormField
                                control={form.control}
                                name="bank"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Bank</FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger className="!bg-input/30">
                                                <SelectValue placeholder="Select a bank" className="!text-black placeholder:!text-black" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {banks.map((bank, index) => (
                                                    <SelectItem key={index} value={bank}>
                                                        {bank}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Account Name (Auto-filled) */}
                            <FormField
                                control={form.control}
                                name="accountName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Name</FormLabel>
                                        <Input {...field} disabled value={accountName} placeholder="Account name" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Amount */}
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <Input {...field} type="number" placeholder="Enter amount" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* User info */}
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <Input {...field} type="text" placeholder="Enter your name" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email info */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <Input {...field} type="email" placeholder="Enter your email" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button type="submit" disabled={isProcessing} className="!text-white h-[50px] !bg-black">
                                {isProcessing ? "Processing Payment..." : "Pay Now"}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold">Payment History</h2>
                        {paymentHistory.length > 0 ? (
                            <ul className="mt-2 border p-4 rounded-lg bg-gray-100">
                                {paymentHistory.map((txn) => (
                                    <li key={txn.transactionId} className="py-2 border-b cursor-pointer" onClick={() => setReceipt(txn)}>
                                        <strong>{txn.transactionId}</strong> - ₦{txn.amount} ({txn.timestamp})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No previous transactions found.</p>
                        )}
                    </div>
                </div>
            )}
            {isAdmin ? (
                <Button
                    onClick={() => navigate("/admin-dashboard")}
                    className="max-sm:hidden fixed bottom-6 right-6 p-3 !bg-black text-white rounded-full shadow-lg"
                >
                    Admin Panel
                </Button>
            ) : (
                <Button
                    onClick={() => navigate("/admin-login")}
                    className="max-sm:hidden fixed bottom-6 right-6 p-3 !bg-black text-white rounded-full shadow-lg"
                >
                    Admin Login
                </Button>
            )}
        </>
    );
}

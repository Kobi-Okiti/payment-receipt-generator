import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Define types for users and transactions
interface User {
    userName: string;
    email: string;
}

interface Transaction {
    userName: string;
    amount: number;
    timestamp: string;
    status: string;
    transactionId: string;
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            navigate("/admin-login");
        }

        // Load transactions and users from localStorage
        const storedTransactions = localStorage.getItem("paymentHistory");
        const storedUsers = localStorage.getItem("paymentHistory");

        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
        }

        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }
    }, [navigate]);

    const handleVerify = (transactionId: string) => {
        // Update the status of the specific transaction
        const updatedData = transactions.map((txn) => {
            if (txn.transactionId === transactionId) {
                return { ...txn, status: "verified" }; // Only update the status
            }
            return txn;
        });

        // Update state
        setTransactions(updatedData);

        // Update the status in localStorage without overwriting the entire data
        localStorage.setItem("paymentHistory", JSON.stringify(updatedData)); // Only update paymentHistory
    };

    const handleViewReceipt = (transactionId: string) => {
        navigate(`/receipt/${transactionId}`);  // Navigate to the receipt page with transactionID
    };

    // Delete user
    const deleteUser = (email: string) => {
        const updatedUsers = users.filter((user) => user.email !== email);
        setUsers(updatedUsers);
        localStorage.setItem("paymentHistory", JSON.stringify(updatedUsers));
    };

    const totalTransactions = transactions.length;
    const pendingPayments = transactions.filter((txn) => txn.status === "pending").length;
    const verifiedPayments = transactions.filter((txn) => txn.status === "verified").length;
    // Safeguard the totalAmount calculation
    const totalAmount = transactions.reduce((total, txn) => total + (Number(txn.amount) || 0), 0);

    // Ensure the totalAmount is a valid number before using .toFixed
    const formattedTotalAmount = totalAmount.toFixed(2);


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <h1 className="!text-[20px] font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem("isAdmin");
                        navigate("/");
                    }}
                    className="bg-red-500 px-4 py-2 rounded"
                >
                    Logout
                </button>
            </header>

            {/* Sidebar & Main Content */}
            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-6">
                    <h2 className="text-xl font-semibold mb-4">Admin Dashboard Overview</h2>

                    {/* Key Metrics Overview */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {/* Total Transactions */}
                        <div className="bg-blue-600 text-white p-4 rounded shadow">
                            <h3 className="text-lg">Total Transactions</h3>
                            <p className="text-2xl">{totalTransactions || 0}</p> {/* Ensure fallback value */}
                        </div>

                        {/* Pending Payments */}
                        <div className="bg-yellow-600 text-white p-4 rounded shadow">
                            <h3 className="text-lg">Pending Payments</h3>
                            <p className="text-2xl">{pendingPayments || 0}</p> {/* Ensure fallback value */}
                        </div>

                        {/* Verified Payments */}
                        <div className="bg-green-600 text-white p-4 rounded shadow">
                            <h3 className="text-lg">Verified Payments</h3>
                            <p className="text-2xl">{verifiedPayments || 0}</p> {/* Ensure fallback value */}
                        </div>

                        {/* Total Amount */}
                        <div className="bg-gray-600 text-white p-4 rounded shadow">
                            <h3 className="text-lg">Total Amount</h3>
                            <p className="text-2xl">₦{formattedTotalAmount}</p> {/* Safely format totalAmount */}
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4 text-center">User Management</h2>

                    {/* Users Table */}
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-3 text-sm font-medium text-gray-700">Name</th>
                                    <th className="p-3 text-sm font-medium text-gray-700">Email</th>
                                    <th className="p-3 text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-sm text-gray-800">{user.userName}</td>
                                        <td className="p-3 text-sm text-gray-800">{user.email}</td>
                                        <td className="p-3">
                                            <Button
                                                onClick={() => deleteUser(user.email)}
                                                className="!bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-xl font-semibold mt-6 mb-4 text-center">Transaction Management</h2>

                    {/* Transactions Table */}
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-3 text-sm font-medium text-gray-700">User</th>
                                    <th className="p-3 text-sm font-medium text-gray-700">Amount</th>
                                    <th className="p-3 text-sm font-medium text-gray-700">Date</th>
                                    <th className="p-3 text-sm font-medium text-gray-700">Status</th>
                                    <th className="p-3 text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.transactionId} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-sm text-gray-800">{transaction.userName}</td>
                                        <td className="p-3 text-sm text-gray-800">₦{transaction.amount}</td>
                                        <td className="p-3 text-sm text-gray-800">{transaction.timestamp}</td>
                                        <td className="p-3 text-sm text-gray-800">
                                            <span
                                                className={`inline-block px-3 py-1 text-sm rounded-full ${transaction.status === 'verified' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                                                    }`}
                                            >
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="p-3 flex gap-2 justify-center items-center">
                                            {transaction.status !== 'verified' && (
                                                <Button
                                                    onClick={() => handleVerify(transaction.transactionId)}
                                                    className=" text-white rounded !bg-black !text-[12px] md:!text-[16px] lg:!text-[16px]"
                                                >
                                                    Verify Payment
                                                </Button>
                                            )}
                                            {transaction.status === 'verified' && (
                                                <Button
                                                    disabled
                                                    className="bg-gray-400 text-white py-2 px-4 rounded"
                                                >
                                                    Verified
                                                </Button>
                                            )}
                                            <Button
                                                className=" text-white rounded !bg-black !text-[12px] md:!text-[16px] lg:!text-[16px]"
                                                onClick={() => handleViewReceipt(transaction.transactionId)}
                                            >
                                                View Receipt
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>
        </div>
    );
}

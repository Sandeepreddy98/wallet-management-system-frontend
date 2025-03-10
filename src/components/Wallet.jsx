import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWallet, transact, getTransactions } from "../api";

const Wallet = () => {
  const { id } = useParams();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "asc",
  });
  const [csvData, setCsvData] = useState("");

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [currentPage]);

  const fetchWallet = async () => {
    try {
      const res = await getWallet(id);
      setWallet(res.data);
    } catch (error) {
      alert("Error fetching wallet!");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions(id, currentPage);
      setTransactions([...transactions, ...res.data]);
    } catch (error) {
      alert("Error fetching transactions!");
    }
  };

  const handleTransaction = async () => {
    setLoading(true);
    try {
      await transact(
        id,
        type === "credit" ? Number(amount) : -1 * Number(amount)
      );
      fetchWallet();
      fetchTransactions();
      setAmount("");
    } catch (error) {
      alert("Transaction failed!");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedTransactions = [...transactions].sort((a, b) => {
      if (key === "amount") {
        return direction === "asc"
          ? Math.sign(a.amount) * a.amount - Math.sign(b.amount) * b.amount
          : Math.sign(b.amount) * b.amount - Math.sign(a.amount) * a.amount;
      }
      if (key === "date") {
        return direction === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    setTransactions(sortedTransactions);
  };

  const prepareCsvData = () => {
    // Define the CSV headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Serial Number,Amount,Type,Balance,Date\n"; // Column headers

    // Append transaction data
    transactions.forEach((tx, index) => {
      const formattedDate = new Date(tx.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const row = `${index + 1},${tx.amount},${tx.type},${
        tx.balance
      },${formattedDate}\n`;
      csvContent += row;
    });

    // Encode as a URI for download
    setCsvData(encodeURI(csvContent));
  };
  return (
    <div className="min-h-screen p-2">
      {wallet ? (
        <>
          <h1 className="text-xl font-bold">Wallet: {wallet.name}</h1>
          <h2 className="text-lg">Balance: ${wallet.balance}</h2>

          <div className="mt-2">
            <input
              className="border p-2 mr-2"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select
              className="border p-2 mr-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
            <button
              onClick={handleTransaction}
              className="bg-green-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-semibold">Transactions</h3>
            <div className="overflow-x-auto border rounded shadow-md">
              <div className="max-h-95 overflow-y-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="py-2 px-4 border text-black">#</th>
                      <th
                        className="py-2 px-4 border text-black cursor-pointer"
                        onClick={() => handleSort("amount")}
                      >
                        Amount ⬍
                      </th>
                      <th className="py-2 px-4 border text-black">Type</th>
                      <th className="py-2 px-4 border text-black">Balance</th>
                      <th
                        className="py-2 px-4 border text-black cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        Date ⬍
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions &&
                      transactions.map((tx, index) => (
                        <tr key={tx._id} className="border">
                          <td className="py-1 px-4 border">{index + 1}</td>
                          <td className="py-1 px-4 border">
                            ${Math.sign(tx.amount) * tx.amount}
                          </td>
                          <td
                            className={`py-1 px-4 border-gray-100 ${
                              tx.type === "CREDIT"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {tx.type}
                          </td>
                          <td className="py-1 px-4 border">${tx.balance}</td>
                          <td className="py-1 px-4 border">
                            {new Date(tx.createdAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            })}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Export CSV Button */}
            <button
              className="mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
              onClick={prepareCsvData}
            >
              Prepare CSV
            </button>

            {csvData && (
              <a
                href={csvData}
                download="transactions.csv"
                className="mt-3 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ml-2 inline-block mr-2"
              >
                Download CSV
              </a>
            )}
            {transactions.length > 0 && (
              <button
                className="mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={loadMore}
              >
                Load More
              </button>
            )}
          </div>
        </>
      ) : (
        <p>Loading wallet...</p>
      )}
    </div>
  );
};

export default Wallet;

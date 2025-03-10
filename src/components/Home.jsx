import { useState } from "react";
import { createWallet } from "../api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const res = await createWallet(name, Number(balance));
      console.log("Wallet Response:", res.data); // ✅ Check if data is correct
      if (res.data && res.data._id) {
        navigate(`/wallet/${res.data._id}`);
      }
    } catch (error) {
      alert("Error creating wallet!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Create Wallet</h1>
      <input
        className="border p-2 mb-2 w-64"
        type="text"
        placeholder="Wallet Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-64"
        type="number"
        placeholder="Initial Balance"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
      />
      <button
        onClick={handleCreateWallet}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Wallet"}
      </button>
    </div>
  );
};

export default Home;

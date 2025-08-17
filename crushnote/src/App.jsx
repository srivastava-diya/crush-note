import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "./CrushNotes.json"; // you'll add later

const CONTRACT_ADDRESS = "0xb648FDd4b1f5e55Ed488f37Fbea9B282E70CA46A";

function App() {
  const [account, setAccount] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState([]);

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } else {
      alert("MetaMask not found!");
    }
  };

  // Send note
  const sendNote = async () => {
    if (!recipient || !message) return alert("Fill all fields!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const tx = await contract.sendNote(recipient, message);
    await tx.wait();
    alert("Note sent!");
  };

  // Get my notes
  const getMyNotes = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    const result = await contract.getNotes(account);
    console.log("Raw result:", result);
    setNotes(result);
  };




  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💌 Onchain Crush Notes</h1>

      {!account ? (
        <button onClick={connectWallet} className="px-4 py-2 bg-pink-500 text-white rounded">
          Connect Wallet
        </button>
      ) : (
        <p>Connected: {account}</p>
      )}

      <div className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Recipient wallet"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Your secret note"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={sendNote} className="px-4 py-2 bg-green-500 text-white rounded">
          Send Note
        </button>
      </div>

      <div className="mt-6">
        <button onClick={getMyNotes} className="px-4 py-2 bg-blue-500 text-white rounded">
          View My Notes
        </button>
        <ul className="mt-4 space-y-2">
          {notes.map((msg, i) => (
            <li key={i} className="p-2 border rounded">
              <strong>Message:</strong> {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

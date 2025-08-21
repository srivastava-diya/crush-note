import { useState } from "react"
import { ethers } from "ethers"
import contractABI from "./CrushNotes.json"

const CONTRACT_ADDRESS = "0xb648FDd4b1f5e55Ed488f37Fbea9B282E70CA46A"

function App() {
  const [account, setAccount] = useState(null)
  const [recipient, setRecipient] = useState("")
  const [message, setMessage] = useState("")
  const [notes, setNotes] = useState([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this app!")
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      alert("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  // Send note
  const sendNote = async () => {
    if (!recipient || !message) {
      alert("Please fill in both the recipient address and your message!")
      return
    }

    setIsSending(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
      const tx = await contract.sendNote(recipient, message)
      await tx.wait()
      alert("💕 Your crush note has been sent successfully!")
      setRecipient("")
      setMessage("")
    } catch (error) {
      console.error("Failed to send note:", error)
      alert("Failed to send note. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  //Get my notes
  const getMyNotes = async () => {
    setIsLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider)
      const result = await contract.getNotes(account)
      console.log("Raw result:", result)
      setNotes(result)
    } catch (error) {
      console.error("Failed to fetch notes:", error)
      alert("Failed to fetch notes. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 bg-clip-text text-transparent mb-2">
             Onchain Crush Notes
          </h1>
          <p className="text-gray-600 text-lg">Send anonymous love notes on the blockchain ✨</p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-pink-100">
          {!account ? (
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600 mb-4">Connect your wallet to start sending crush notes</p>
              </div>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet 🔗"}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Connected Wallet</p>
                  <p className="font-mono text-sm text-gray-800">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="text-green-600 text-2xl">💚</div>
            </div>
          )}
        </div>

        {account && (
          <>
            {/* Send Note Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-pink-100">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">💕</span>
                <h2 className="text-xl font-semibold text-gray-800">Send a Crush Note</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Wallet Address</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Secret Message</label>
                  <textarea
                    placeholder="Write your heartfelt message here... 💖"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  />
                </div>

                <button
                  onClick={sendNote}
                  disabled={isSending || !recipient || !message}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? "Sending... 📤" : "Send Crush Note 💌"}
                </button>
              </div>
            </div>

            {/* View Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📬</span>
                  <h2 className="text-xl font-semibold text-gray-800">My Received Notes</h2>
                </div>
                <button
                  onClick={getMyNotes}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Refresh 🔄"}
                </button>
              </div>

              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-3">💔</div>
                  <p className="text-gray-500">No crush notes yet...</p>
                  <p className="text-sm text-gray-400 mt-1">Share your wallet address to receive some love!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((msg, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">💖</div>
                        <div className="flex-1">
                          <p className="text-gray-800 leading-relaxed">{msg}</p>
                          <p className="text-xs text-gray-500 mt-2">Note #{i + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Made with 💕 for anonymous blockchain romance</p>
        </div>
      </div>
    </div>
  )
}

export default App

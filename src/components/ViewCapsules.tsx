import { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  Clock,
  Archive,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  getCapsules,
  unlockCapsule,
  deleteCapsule,
} from "../lib/api";

interface TimeCapsule {
  id: string;
  username: string;
  message?: string;
  openDateTime: string;
  createdAt: string;
  opened: boolean;
}

interface Props {
  currentUsername: string;
  setCurrentUsername: (username: string) => void;
}

export function ViewCapsules({
  currentUsername,
  setCurrentUsername,
}: Props) {
  const [username, setUsername] = useState(currentUsername);
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [selectedCapsule, setSelectedCapsule] = useState<
    string | null
  >(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadCapsules = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const data = await getCapsules(username);
      setCapsules(data);
      setCurrentUsername(username);
    } catch (err) {
      console.error("Error loading capsules:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load capsules",
      );
      setCapsules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (capsule: TimeCapsule) => {
    const openTime = new Date(capsule.openDateTime);

    if (currentTime < openTime) {
      setError("This capsule is not ready to be opened yet");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!passwordInput.trim()) {
      setError("Please enter a password");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setUnlocking(true);
    setError("");

    try {
      const message = await unlockCapsule(
        capsule.id,
        passwordInput,
      );

      const updatedCapsules = capsules.map((c) =>
        c.id === capsule.id
          ? { ...c, opened: true, message }
          : c,
      );
      setCapsules(updatedCapsules);
      setPasswordInput("");
      setSelectedCapsule(null);
    } catch (err) {
      console.error("Error unlocking capsule:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to unlock capsule",
      );
      setTimeout(() => setError(""), 3000);
    } finally {
      setUnlocking(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm("Are you sure you want to delete this capsule?")
    ) {
      return;
    }

    try {
      await deleteCapsule(id, username);
      setCapsules(capsules.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting capsule:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete capsule",
      );
      setTimeout(() => setError(""), 3000);
    }
  };

  const getTimeUntilOpen = (openDateTime: string) => {
    const openTime = new Date(openDateTime);
    const diff = openTime.getTime() - currentTime.getTime();

    if (diff <= 0) return "Ready to open";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m ${seconds}s remaining`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-10 border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-6">
            <Archive className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl mb-3 text-amber-400">
            Your Capsules
          </h2>
          <p className="text-slate-400">
            View and unlock your time capsules
          </p>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-slate-300 text-sm uppercase tracking-wider">
            Enter Username
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && loadCapsules()
              }
              placeholder="Your username"
              className="flex-1 px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              onClick={loadCapsules}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 rounded-lg transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load Capsules"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}
      </div>

      {hasSearched && capsules.length === 0 && !loading && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-16 border border-slate-700/50 text-center">
          <Archive className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <h3 className="text-xl mb-2 text-slate-400">
            No capsules found
          </h3>
          <p className="text-slate-500">
            Create your first time capsule to get started
          </p>
        </div>
      )}

      {capsules.map((capsule) => {
        const canOpen =
          new Date(capsule.openDateTime) <= currentTime;
        const isSelected = selectedCapsule === capsule.id;

        return (
          <div
            key={capsule.id}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {capsule.opened ? (
                    <Unlock className="w-5 h-5 text-emerald-400" />
                  ) : canOpen ? (
                    <Lock className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-500" />
                  )}
                  <h3 className="text-xl text-slate-200">
                    {capsule.username}
                  </h3>
                </div>

                <div className="space-y-1 text-sm text-slate-400">
                  <p>
                    Created:{" "}
                    {new Date(capsule.createdAt).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    )}
                  </p>
                  <p>
                    Opens:{" "}
                    {new Date(
                      capsule.openDateTime,
                    ).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                {!capsule.opened && (
                  <div className="flex items-center gap-2 mt-3">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span
                      className={`text-sm ${canOpen ? "text-emerald-400" : "text-amber-400"}`}
                    >
                      {getTimeUntilOpen(capsule.openDateTime)}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDelete(capsule.id)}
                className="text-red-400/50 hover:text-red-400 transition-colors p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {capsule.opened ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-4">
                <p className="text-emerald-400 text-sm mb-2 uppercase tracking-wider">
                  Message:
                </p>
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {capsule.message}
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <button
                  onClick={() =>
                    setSelectedCapsule(
                      isSelected ? null : capsule.id,
                    )
                  }
                  className={`w-full py-3 rounded-lg transition-all border ${
                    canOpen
                      ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400"
                      : "bg-slate-700/20 border-slate-600/30 text-slate-500 cursor-not-allowed"
                  }`}
                  disabled={!canOpen}
                >
                  {canOpen ? "Unlock Message" : "Locked"}
                </button>

                {isSelected && canOpen && (
                  <div className="mt-4 space-y-3">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type={
                          showPassword ? "text" : "password"
                        }
                        value={passwordInput}
                        onChange={(e) =>
                          setPasswordInput(e.target.value)
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          handleUnlock(capsule)
                        }
                        placeholder="Enter password"
                        className="w-full pl-12 pr-12 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => handleUnlock(capsule)}
                      disabled={unlocking}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      {unlocking ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Unlocking...
                        </>
                      ) : (
                        <>
                          <Unlock className="w-5 h-5" />
                          Unlock Capsule
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
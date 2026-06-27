'use client';

import { useEffect, useState } from 'react';

type Notification = {
  id: number;
  recipient: string;
  channel: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const fetchNotifications = async () => {
    const res = await fetch('http://localhost:3000/notifications');
    const data = await res.json();
    setNotifications(data);
  };

  const sendNotification = async () => {
    await fetch('http://localhost:3000/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient,
        channel: 'EMAIL',
        message,
      }),
    });

    setRecipient('');
    setMessage('');
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const total = notifications.length;
  const delivered = notifications.filter(n => n.status === 'DELIVERED').length;
  const pending = notifications.filter(n => n.status === 'PENDING').length;
  const failed = notifications.filter(n => n.status === 'FAILED').length;

  return (
<main style={{ minHeight: '100vh', padding: '40px', background: 'linear-gradient(135deg, #020617, #0f172a)' }}>
      <section className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm text-cyan-300">AI Orchestration Notification Platform</p>
          <h1 className="text-4xl font-bold mt-2">Pulse Dashboard</h1>
          <p className="text-slate-400 mt-3">
            Send, track, and process notifications asynchronously.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card title="Total" value={total} />
          <Card title="Delivered" value={delivered} />
          <Card title="Pending" value={pending} />
          <Card title="Failed" value={failed} />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Create Notification</h2>

            <label className="text-sm text-slate-400">Recipient Email</label>
            <input
              className="w-full mt-2 mb-4 rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              placeholder="you@example.com"
            />

            <label className="text-sm text-slate-400">Message</label>
            <textarea
              className="w-full mt-2 mb-4 rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 outline-none min-h-32"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write notification message..."
            />

            <button
              onClick={sendNotification}
              className="w-full rounded-lg bg-cyan-400 text-slate-950 font-semibold py-3 hover:bg-cyan-300"
            >
              Send Notification
            </button>
          </div>

          <div className="col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>

            <div className="space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className="rounded-xl bg-slate-950 border border-slate-800 p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{notification.recipient}</p>
                      <p className="text-sm text-slate-400">{notification.message}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm">
                      {notification.status}
                    </span>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <p className="text-slate-500">No notifications yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
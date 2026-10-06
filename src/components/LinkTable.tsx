"use client";

import { useState, useEffect, useCallback } from "react";

interface LinkItem {
  id: string;
  code: string;
  destinationUrl: string;
  createdAt: string;
  expiresAt: string;
  scanCount: number;
  revoked: boolean;
}

export default function LinkTable() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data.links || []);
    } catch {
      console.error("Failed to fetch links");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this link? This cannot be undone.")) {
      return;
    }

    setRevokingId(id);
    try {
      const res = await fetch("/api/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchLinks();
      }
    } catch {
      console.error("Failed to revoke link");
    } finally {
      setRevokingId(null);
    }
  };

  const getStatus = (link: LinkItem): { label: string; className: string } => {
    if (link.revoked) return { label: "Revoked", className: "status--revoked" };
    if (new Date() > new Date(link.expiresAt)) return { label: "Expired", className: "status--expired" };
    return { label: "Active", className: "status--active" };
  };

  if (loading) {
    return (
      <div className="table-loading">
        <span className="btn-spinner btn-spinner--lg" />
        <p>Loading your links…</p>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="table-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <h3>No links yet</h3>
        <p>Generate your first secure QR link to see it here.</p>
      </div>
    );
  }

  return (
    <div className="table-container" id="links-table">
      <table className="link-table">
        <thead>
          <tr>
            <th>Short Link</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Scans</th>
            <th>Created</th>
            <th>Expires</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => {
            const status = getStatus(link);
            return (
              <tr key={link.id} className={link.revoked ? "row--revoked" : ""}>
                <td>
                  <a
                    href={`${baseUrl}/r/${link.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-code"
                  >
                    /r/{link.code}
                  </a>
                </td>
                <td>
                  <span className="link-destination" title={link.destinationUrl}>
                    {link.destinationUrl.length > 40
                      ? link.destinationUrl.substring(0, 40) + "…"
                      : link.destinationUrl}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td>
                  <span className="scan-count">{link.scanCount}</span>
                </td>
                <td className="date-cell">
                  {new Date(link.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="date-cell">
                  {new Date(link.expiresAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td>
                  {!link.revoked && new Date() <= new Date(link.expiresAt) && (
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => handleRevoke(link.id)}
                      disabled={revokingId === link.id}
                      id={`revoke-btn-${link.code}`}
                    >
                      {revokingId === link.id ? "…" : "Revoke"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

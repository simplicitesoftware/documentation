import React from 'react';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const URL = "https://platform.simplicite.io/versions.json";

export default function VersionsTable({})
{
    const [versions, setVersions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    // Fetch version data on mount
    useEffect(() => {
        setLoading(true);
        fetch(URL)
            .then(response => {
                if (!response.ok)
                    throw new Error("Network response not OK");
                return response.json();
            })
            .then(data => {
                let platform = data['platform'];
                let map = new Map();

                Object.entries(platform).forEach(([v,c]) => {
                    map.set(v,c);
                });

                setVersions(map);
                setLoading(false);
            })
            .catch(err => {
                console.error(`Error fetching json at "${URL}":\n-> ${err}\n`);
                setErr(err);
                setLoading(false);
            });
    }, []);

    function formatStatus(m, st) {
        let status;
        switch (m) {
            case "active":
                switch (st) {
                    case "shortterm":
                        status = "☑️ Short Term";
                        break;
                    case "longterm":
                        status = "☑️ Long Term";
                        break;
                    default:
                        status = "✅ Current";
                        break;
                }
                break;
            case "alpha":
                status = "🚧 Alpha";
                break;
            case "expired":
                status = "❌ Expired";
                break;
            default:
                status = "Unknown";
                break;
        }
        return status;
    }

    function getClassName(maintenance, supportType) {
        if (maintenance === "active") {
            if (supportType) {
                return styles[supportType] || '';
            }
            return styles[maintenance] || '';
        } else {
            return styles[maintenance] || '';
        }
    }

    function prettierDate(date) {
        if (!date) return 'N/A';
        
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) return date; // Return original if parsing fails
            
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            
            const month = months[d.getMonth()];
            const day = d.getDate();
            const year = d.getFullYear();
            
            return `${month} ${day} of ${year}`;
        } catch (e) {
            console.error('Error formatting date:', e);
            return date; // Return original on error
        }
    }

    if (loading) return <div>Loading versions data...</div>;
    if (err) return <div>Error loading data: {error.message}</div>;
    if (!versions || versions.size === 0) return <div>No version data available</div>;

    return (
        <div className={styles.versionsTableContainer}>
            <table className={styles.versionsTable}>
                <thead>
                    <tr>
                        <th>Version</th>
                        <th>Status</th>
                        <th>First Release Date</th>
                        <th>Last Release</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(versions).map(([version, data]) => (
                        <tr key={version}>
                            <td className={styles.versionCell}>{version}</td>
                            <td className={getClassName(data.maintenance, data.support_type)}>
                                {formatStatus(data.maintenance, data.support_type)}
                            </td>
                            <td className={styles.dateCell}>
                                {prettierDate(data.initial_release_date)}
                            </td>
                            <td className={styles.releaseCell}>
                                {data.version} - {prettierDate(data.date)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
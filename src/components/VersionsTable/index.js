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

    function prettierMaintenance(m, st) {
        let maintenance;
        switch (m) {
            case "active":
                switch (st) {
                    case "shortterm":
                        maintenance = "☑️ Maintained (*)";
                        break;
                    case "longterm":
                        maintenance = "☑️ Maintained (*)";
                        break;
                    default:
                        maintenance = "✅ Current";
                        break;
                }
                break;
            case "alpha":
                maintenance = "🚧 Alpha";
                break;
            case "expired":
                maintenance = "❌ Expired";
                break;
            default:
                maintenance = "Not Applicable";
                break;
        }
        return maintenance;
    }

    function prettierSupport(st) {
        let support;
        switch (st) {
            case "shortterm":
                support = "Short Term - STS";
                break;
            case "longterm":
                support = "Long Term - LTS";
                break;
            default:
                support = "N/A";
                break;
        }
        return support;
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
            const d_ = d.getDate();
            const year = d.getFullYear();
            
            let day;
            switch (d_) {
                case 1:
                    day = d_+"st";
                    break;
                case 2:
                    day = d_+"nd";
                    break;
                case 3:
                    day = d_+"rd";
                    break;
                default:
                    day = d_+"th";
                    break;
            }

            return `${month} ${day}, ${year}`;
        } catch (e) {
            console.error('Error formatting date:', e);
            return date; // Return original on error
        }
    }

    function scrollToBlock(v, e) {
        e.preventDefault();
        const elt = document.getElementById(v);

        if (elt) {
            const rect = elt.getBoundingClientRect();
            const top = rect.top + window.pageYOffset;
            const wh = window.innerHeight;
            const h = rect.height;
            const offset = top - (wh/2) + (h/2);

            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    }

    function toAnchor(v) {
        return "v" + v.replace(".", "-");
    }
    if (loading) return <div>Loading versions data...</div>;
    if (err) return <div>Error loading data: {err.message}</div>;
    if (!versions || versions.size === 0) return <div>No version data available</div>;

    return (
        <div className={styles.versionsTableContainer}>
            <table className={styles.versionsTable}>
                <thead>
                    <tr>
                        <th>Version</th>
                        <th>Release Note</th>
                        <th>Status</th>
                        <th>Support Type</th>
                        <th>First Release Date</th>
                        <th>Last Release</th>
                        <th>Maintenance End</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(versions).map(([version, data]) => (
                        <tr key={version}>
                            <td>
                                <a
                                    href={`#${version}`}
                                    onClick={(e) => scrollToBlock(version,e)}
                                >
                                    {version}
                                </a>
                            </td>
                            <td>
                                {(!version.startsWith("4") && !version.startsWith("3")) ? <a
                                    href={`../../versions/release-notes/${toAnchor(version)}`}
                                >
                                    Release Note
                                </a> 
                                : "Unavailable"}
                            </td>
                            <td className={getClassName(data.maintenance, data.support_type)}>
                                {prettierMaintenance(data.maintenance, data.support_type)}
                            </td>
                            <td className={getClassName(data.maintenance, data.support_type)}>
                                {prettierSupport(data.support_type)}
                            </td>
                            <td className={styles.dateCell}>
                                {prettierDate(data.initial_release_date)}
                            </td>
                            <td className={styles.releaseCell}>
                                {data.version} - {prettierDate(data.date)}
                            </td>
                            <td>{data.maintenance_end_date ? prettierDate(data.maintenance_end_date) : "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <span><b>(*) Important </b>⚠️ Maintained versions should not be used for new (or projects in implementation phase). Using the current release is <i>always</i> the best option 😉</span>
        </div>
    )
}
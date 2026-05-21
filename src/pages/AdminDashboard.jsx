import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { db } from '../db';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('clarity');
  const [data, setData] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      if (localStorage.getItem('isAuthenticated') !== 'true') {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const getData = useCallback(async () => {
    if (activeTab === 'clarity') return db.assessments.toArray();
    if (activeTab === 'readiness') return db.readiness.toArray();
    if (activeTab === 'execution') return db.execution.toArray();
    if (activeTab === 'testimonials') return db.testimonials.toArray();
    return [];
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;
    getData().then((result) => {
      if (isMounted) setData(result);
    });
    return () => {
      isMounted = false;
    };
  }, [getData]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const exportToExcel = () => {
    const exportData = data.map((item) => {
      const rest = { ...item };
      delete rest.id;
      delete rest.answers;
      return {
        ...rest,
        date: new Date(rest.date).toLocaleString(),
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, `Phoenix_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const approveTestimonial = async (id) => {
    await db.testimonials.update(id, { status: 'Approved' });
    setData(await getData());
  };

  const rejectTestimonial = async (id) => {
    await db.testimonials.update(id, { status: 'Rejected' });
    setData(await getData());
  };

  const totalRecords = data.length;
  const averageScore = data.length
    ? Math.round(data.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / data.filter(item => item.score !== undefined).length)
    : 0;
  const pendingTestimonials = activeTab === 'testimonials'
    ? data.filter(item => item.status === 'Pending Review').length
    : 0;
  const latestRecord = data.length
    ? data.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null;

  const tabs = [
    { key: 'clarity', label: 'Clarity', count: activeTab === 'clarity' ? totalRecords : null },
    { key: 'readiness', label: 'Readiness', count: activeTab === 'readiness' ? totalRecords : null },
    { key: 'execution', label: 'Execution', count: activeTab === 'execution' ? totalRecords : null },
    { key: 'testimonials', label: 'Testimonials', count: activeTab === 'testimonials' ? totalRecords : null },
  ];

  return (
    <div className="admin-shell animate-fade-slide">
      <div className="admin-hero">
        <div>
          <div className="admin-kicker">Phoenix Coach Console</div>
          <h2>Admin Dashboard</h2>
          <p>Review assessment records, export client data, and manage stories from one focused workspace.</p>
        </div>
        <div className="admin-actions">
          <button onClick={exportToExcel} className="btn btn-gold">Export {activeTab}</button>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>Total Records</span>
          <strong>{totalRecords}</strong>
        </div>
        <div className="admin-stat-card">
          <span>{activeTab === 'testimonials' ? 'Pending Review' : 'Average Score'}</span>
          <strong>{activeTab === 'testimonials' ? pendingTestimonials : `${Number.isFinite(averageScore) ? averageScore : 0}%`}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Latest Entry</span>
          <strong>{latestRecord ? new Date(latestRecord.date).toLocaleDateString() : '—'}</strong>
        </div>
      </div>

      <div className="admin-tabs" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`admin-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.count !== null && <span>{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <div>
            <div className="admin-table-label">{activeTab}</div>
            <h3>{activeTab === 'testimonials' ? 'Story Submissions' : 'Assessment Records'}</h3>
          </div>
          <div className="admin-table-meta">{totalRecords} {totalRecords === 1 ? 'record' : 'records'}</div>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Name</th>
              {(activeTab === 'clarity' || activeTab === 'readiness' || activeTab === 'execution') && <th>Score</th>}
              {activeTab === 'clarity' && <th>Archetype</th>}
              {activeTab === 'testimonials' && <th>Stage</th>}
              {activeTab === 'testimonials' && <th>Status</th>}
              {activeTab === 'testimonials' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="admin-empty">
                    <div>No data available for {activeTab}.</div>
                    <p>New submissions will appear here as soon as they are saved.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.firstName} {item.lastName}</td>
                  {(activeTab === 'clarity' || activeTab === 'readiness' || activeTab === 'execution') && <td><span className="score-badge">{item.score}%</span></td>}
                  {activeTab === 'clarity' && <td>{item.archetypeName || item.archetype}</td>}
                  {activeTab === 'testimonials' && <td>{item.stage}</td>}
                  {activeTab === 'testimonials' && (
                    <td>
                      <span className={`status-pill status-${(item.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.status}
                      </span>
                    </td>
                  )}
                  {activeTab === 'testimonials' && (
                    <td>
                      {item.status === 'Pending Review' && (
                        <div className="row-actions">
                          <button onClick={() => approveTestimonial(item.id)} className="mini-btn approve">Approve</button>
                          <button onClick={() => rejectTestimonial(item.id)} className="mini-btn reject">Reject</button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

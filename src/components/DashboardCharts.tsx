"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ActivityChart() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    return () => observer.disconnect();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: { color: isDark ? '#94a3b8' : '#64748b' }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: { color: isDark ? '#94a3b8' : '#64748b' }
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        fill: true,
        label: 'Documents Generated',
        data: [12, 19, 15, 25, 22, 30, 45],
        borderColor: '#ceb070',
        backgroundColor: 'rgba(206, 176, 112, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#ceb070',
      },
    ],
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line options={options} data={data} />
    </div>
  );
}

export function TemplateUsageChart() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: { color: isDark ? '#94a3b8' : '#64748b' }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: { color: isDark ? '#94a3b8' : '#64748b' }
      },
    },
  };

  const data = {
    labels: ['Affidavit', 'Petition', 'NDA', 'Will', 'Contract'],
    datasets: [
      {
        label: 'Templates Used',
        data: [65, 40, 85, 30, 55],
        backgroundColor: '#1e293b',
        borderRadius: 8,
        hoverBackgroundColor: '#ceb070',
      },
    ],
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Bar options={options} data={data} />
    </div>
  );
}

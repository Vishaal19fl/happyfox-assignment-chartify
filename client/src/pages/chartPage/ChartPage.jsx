import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Chip, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './ChartPage.scss';
import MemberList from '../../components/memberList/MemberList';
import Pretender from 'pretender';

// Setup Pretender server to mock API endpoints
const server = new Pretender(function() {
  
  const employeeData = [
    { id: 1, name: "Mark Hill", designation: "CEO", team: "Executive", managerId: null, image: "/img/m1.png" },
    { id: 2, name: "Joe Linux", designation: "CTO", team: "Executive", managerId: 1, image: "/img/m2.png" },
    { id: 3, name: "Linda May", designation: "CFO", team: "Finance", managerId: 1, image: "/img/w1.png" },
    { id: 4, name: "John Green", designation: "VP of Engineering", team: "Engineering", managerId: 2, image: "/img/m3.png" },
    { id: 5, name: "Ron Blomquist", designation: "VP of IT", team: "IT", managerId: 2, image: "/img/w2.png" },
    { id: 6, name: "Michael Rubin", designation: "VP of Finance", team: "Finance", managerId: 3, image: "/img/m4.png" },
    { id: 7, name: "Alice Johnson", designation: "Engineering Manager", team: "Engineering", managerId: 4, image: "/img/m5.png" },
    { id: 8, name: "Bob Williams", designation: "IT Manager", team: "IT", managerId: 5, image: "/img/w3.png" },
    { id: 9, name: "Carol Smith", designation: "Financial Analyst", team: "Finance", managerId: 6, image: "/img/m6.png" },
    { id: 10, name: "Dave Brown", designation: "Software Engineer", team: "Engineering", managerId: 7, image: "/img/w4.png" },
    { id: 11, name: "Eve Davis", designation: "System Administrator", team: "IT", managerId: 8, image: "/img/m7.png" },
    { id: 12, name: "Frank Wilson", designation: "Accountant", team: "Finance", managerId: 9, image: "/img/w5.png" },
  ];

  // GET endpoint to fetch all employees
  this.get('/api/employees', () => {
    return [200, { 'Content-Type': 'application/json' }, JSON.stringify(employeeData)];
  });

  // PUT endpoint to update an employee's manager
  this.put('/api/employees/:id/manager', (request) => {
    const id = parseInt(request.params.id);
    const { managerId } = JSON.parse(request.requestBody);
    
    const employee = employeeData.find(emp => emp.id === id);
    if (employee) {
      employee.managerId = managerId;
    }
    
    return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ 
      success: true, 
      message: `Updated employee ${id}'s manager to ${managerId}` 
    })];
  });
});

const TeamChip = styled(Chip)(({ theme, team }) => {
  const getColors = () => {
    switch (team) {
      case 'Executive':
        return { bg: '#4caf50', color: '#fff' };
      case 'Engineering':
        return { bg: '#2196f3', color: '#fff' };
      case 'IT':
        return { bg: '#9c27b0', color: '#fff' };
      case 'Finance':
        return { bg: '#ff9800', color: '#fff' };
      default:
        return { bg: '#e0e0e0', color: '#333' };
    }
  };

  const colors = getColors();
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 'bold',
    fontSize: '0.7rem',
  };
});

// EmployeeNode component for the org chart (with reduced size)
const EmployeeNode = ({ employee, employees, handleDrop, onDragStart, zoomLevel }) => {
  // Find direct reports of this employee
  const directReports = employees.filter(emp => emp.managerId === employee.id);

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    const draggedEmployeeId = parseInt(e.dataTransfer.getData('employeeId'));
    handleDrop(draggedEmployeeId, employee.id);
  };

  // Calculate size scaling based on zoomLevel
  const avatarSize = 40 + (zoomLevel * 10); // Base size 40px, adjust by 10px per zoom level
  const nodeWidth = 140 + (zoomLevel * 20); // Base width 140px, adjust by 20px per zoom level
  
  return (
    <div className="org-node-container">
      <div 
        className="org-node"
        draggable
        onDragStart={(e) => onDragStart(e, employee.id)}
        onDragOver={onDragOver}
        onDrop={onDrop}
        data-team={employee.team}
        style={{ width: `${nodeWidth}px` }}
      >
        <div className="employee-avatar">
          <Avatar 
            src={employee.image} 
            alt={employee.name}
            className="avatar-image"
            sx={{ width: avatarSize, height: avatarSize }}
          />
        </div>
        <div className="employee-info">
          <div className="employee-name">{employee.name}</div>
          <div className="employee-designation">{employee.designation}</div>
          <TeamChip 
            label={employee.team}
            team={employee.team}
            size="small"
            className="team-chip"
          />
        </div>
      </div>

      {directReports.length > 0 && (
        <div className="org-children">
          {directReports.map(report => (
            <EmployeeNode 
              key={report.id} 
              employee={report} 
              employees={employees} 
              handleDrop={handleDrop}
              onDragStart={onDragStart}
              zoomLevel={zoomLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// OrgChart component with zoom controls
const OrgChart = ({ employees, handleDrop, zoomLevel, setZoomLevel }) => {
  // Find the root employee (CEO)
  const rootEmployee = employees.find(emp => emp.managerId === null);

  const onDragStart = (e, employeeId) => {
    e.dataTransfer.setData('employeeId', employeeId);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 3) setZoomLevel(zoomLevel + 1);
  };

  const handleZoomOut = () => {
    if (zoomLevel > -2) setZoomLevel(zoomLevel - 1);
  };
  const handleDownloadPDF = async () => {
    const chart = document.querySelector('.org-chart');
    
    const canvas = await html2canvas(chart, {
      scale: 4,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedChart = clonedDoc.querySelector('.org-chart');
        clonedChart.style.padding = '40px';
        clonedChart.style.width = 'auto';
        clonedChart.style.height = 'auto';
        
        // Hide team chips in the PDF
        const teamChips = clonedDoc.querySelectorAll('.team-chip');
        teamChips.forEach(chip => {
          chip.style.display = 'none';
        });

        // Add team name as text instead
        const employeeInfos = clonedDoc.querySelectorAll('.employee-info');
        employeeInfos.forEach(info => {
          const teamChip = info.querySelector('.team-chip');
          if (teamChip) {
            const teamName = teamChip.textContent;
            const teamText = document.createElement('div');
            teamText.textContent = teamName;
            teamText.style.fontSize = '12px';
            teamText.style.fontWeight = '800';
            teamText.style.color = '#666';
            teamText.style.marginTop = '4px';
            info.appendChild(teamText);
          }
        });
      }
    });
    const imgWidth = 210; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // First add the chart image
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      45,
      imgWidth,
      imgHeight
    );
    
    // Add header content
    pdf.setFontSize(20);
    pdf.setTextColor(219, 98, 0);
    pdf.text('HappyFox Chartify Document', 105, 20, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setTextColor(51, 51, 51);
    pdf.text('Organization Chart', 105, 30, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    const date = new Date().toLocaleDateString();
    pdf.text(`Generated on: ${date}`, 105, 38, { align: 'center' });
    
    // Add horizontal line
    pdf.setDrawColor(219, 98, 0);
    pdf.setLineWidth(0.5);
    pdf.line(20, 42, 190, 42);
    
    // Add decorative border last to ensure it's on top
    // Single orange border
    pdf.setDrawColor(219, 98, 0);
    pdf.setLineWidth(1);
    pdf.rect(10, 10, 190, 277);
    
    // Corner decorations
    pdf.setDrawColor(219, 98, 0);
    pdf.setLineWidth(1);
    // Top-left
    pdf.line(10, 15, 20, 15);
    pdf.line(15, 10, 15, 20);
    // Top-right
    pdf.line(190, 15, 200, 15);
    pdf.line(195, 10, 195, 20);
    // Bottom-left
    pdf.line(10, 282, 20, 282);
    pdf.line(15, 277, 15, 287);
    // Bottom-right
    pdf.line(190, 282, 200, 282);
    pdf.line(195, 277, 195, 287);
    
    pdf.save('happyfox-organization-chart.pdf');
  };
  return (
    <div className="org-chart-container">
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '10px' }}>
        <div className="zoom-controls" style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Zoom Out">
            <IconButton onClick={handleZoomOut} disabled={zoomLevel <= -2}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom In">
            <IconButton onClick={handleZoomIn} disabled={zoomLevel >= 3}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div>
        
        <Tooltip title="Download PDF">
          <Box 
            component="button"
            onClick={handleDownloadPDF}
            className="download-pdf-btn"
          >
            <DownloadIcon />
            Download PDF
          </Box>
        </Tooltip>
        </div>
      </div>
      <div className="org-chart" style={{ padding: `${30 + (zoomLevel * 5)}px` }}>
        <div className="org-chart-background"></div>
        {rootEmployee && (
          <EmployeeNode 
            employee={rootEmployee} 
            employees={employees} 
            handleDrop={handleDrop}
            onDragStart={onDragStart}
            zoomLevel={zoomLevel}
          />
        )}
      </div>
    </div>
  );
};

// Main OrgChart page component
const ChartPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0); // 0 is default, range from -2 to 3

  // Fetch employees from API on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/employees');
        const data = await response.json();
        setEmployees(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch employees. Please try again later.');
        setLoading(false);
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();
  }, []);

  // Extract unique teams for the filter dropdown
  useEffect(() => {
    const uniqueTeams = [...new Set(employees.map(emp => emp.team))];
    setTeams(uniqueTeams);
  }, [employees]);

  // Function to handle employee drag and drop to change manager
  const handleDrop = async (employeeId, newManagerId) => {
    // Prevent setting own manager or creating circular references
    if (employeeId === newManagerId || wouldCreateCircularReference(employeeId, newManagerId)) {
      return;
    }

    try {
      // Optimistic UI update
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === employeeId ? { ...emp, managerId: newManagerId } : emp
        )
      );
      
      // Call API to update the employee's manager
      const response = await fetch(`/api/employees/${employeeId}/manager`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ managerId: newManagerId }),
      });
      
      const result = await response.json();
      console.log(result.message);
    } catch (err) {
      console.error('Error updating employee manager:', err);
      // Fetch fresh data to reset state if API call fails
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data);
    }
  };

  // Check if setting a new manager would create a circular reference
  const wouldCreateCircularReference = (employeeId, newManagerId) => {
    let currentManagerId = newManagerId;
    while (currentManagerId !== null) {
      if (currentManagerId === employeeId) {
        return true;
      }
      const manager = employees.find(emp => emp.id === currentManagerId);
      currentManagerId = manager ? manager.managerId : null;
    }
    return false;
  };

  // Filter employees for the org chart based on selected team
  const filteredChartEmployees = selectedTeam
    ? employees.filter(emp => {
        // Include employees from selected team and their managers
        if (emp.team === selectedTeam) return true;
        
        // Check if this employee is a manager of any employee in the selected team
        const isManager = employees
          .filter(e => e.team === selectedTeam)
          .some(e => {
            let currentManagerId = e.managerId;
            while (currentManagerId !== null) {
              if (currentManagerId === emp.id) return true;
              const manager = employees.find(m => m.id === currentManagerId);
              currentManagerId = manager ? manager.managerId : null;
            }
            return false;
          });
          
        return isManager;
      })
    : employees;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <Box className="org-chart-page" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading organization data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="org-chart-page" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="org-chart-page" sx={{ padding: '2.9rem 0 0 0', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      
      <Box className="org-chart-layout" sx={{ display: 'flex', flex: 1, overflow: 'hidden'}}>
        
        <MemberList
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          employees={employees}
          searchTerm={searchTerm}
          selectedTeam={selectedTeam}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onTeamChange={(e) => setSelectedTeam(e.target.value)}
          teams={teams}
        />
        
        <Box className="main-content" sx={{ 
          flex: 1, 
          overflow: 'auto', 
          backgroundColor: 'white', 
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)', 
          position: 'relative', 
          borderLeft: '1px solid #e0e0e0' 
        }}>
          <Typography 
            variant="h6" 
            className="panel-title"
            sx={{
              padding: '12px',
              margin: 0,
              background: 'linear-gradient(135deg,rgb(219, 98, 0),rgb(255, 115, 0))',
              color: 'white',
              fontWeight: 600,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Organization Hierarchy
          </Typography>
          <OrgChart 
            employees={filteredChartEmployees} 
            handleDrop={handleDrop}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
          />
        </Box>
      </Box>
    </Box>
  );
};

// Clean up Pretender server when component unmounts
// This would typically be in a useEffect cleanup function
// but for simplicity we're adding it here
window.addEventListener('beforeunload', () => {
  if (server) {
    server.shutdown();
  }
});

export default ChartPage;
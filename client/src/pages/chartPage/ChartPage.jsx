import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Chip, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './ChartPage.scss';
import MemberList from '../../components/memberList/MemberList';
import Pretender from 'pretender';
import { employeeData } from '../../data';


const SuccessToast = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '20px 16px',
  borderRadius: '8px',
  backgroundColor: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  maxWidth: '400px',
  animation: 'slideIn 0.3s ease-out',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '4px',
    backgroundColor: '#4caf50',
  },
  '@keyframes slideIn': {
    '0%': {
      transform: 'translateY(20px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
}));


const AnimatedCheckIcon = styled(CheckCircleIcon)(({ theme }) => ({
  color: '#4caf50',
  fontSize: '24px',
  marginRight: '12px',
  animation: 'popAndSpin 0.5s ease-out',
  '@keyframes popAndSpin': {
    '0%': {
      transform: 'scale(0) rotate(-90deg)',
    },
    '50%': {
      transform: 'scale(1.2) rotate(0deg)',
    },
    '100%': {
      transform: 'scale(1) rotate(0deg)',
    },
  },
}));


let server;


if (server) {
  server.shutdown();
}


server = new Pretender(function() {
  
  this.get('/api/employees', () => {
    return [200, { 'Content-Type': 'application/json' }, JSON.stringify(employeeData)];
  });

  this.put('/api/employees/:id/manager', (request) => {
    const id = parseInt(request.params.id);
    const { managerId } = JSON.parse(request.requestBody);
    
    const employee = employeeData.find(emp => emp.id === id);
    const newManager = employeeData.find(emp => emp.id === managerId);
    
    if (employee && newManager) {
      employee.managerId = managerId;
    }
    
    return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ 
      success: true, 
      message: `Updated employee ${employee.name} (ID: ${employee.id}) manager to ${newManager.name} (ID: ${newManager.id})`,
      employeeName: employee.name,
      managerName: newManager.name
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


const EmployeeNode = ({ employee, employees, handleDrop, onDragStart, zoomLevel }) => {
  
  const directReports = employees.filter(emp => emp.managerId === employee.id);

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    const draggedEmployeeId = parseInt(e.dataTransfer.getData('employeeId'));
    handleDrop(draggedEmployeeId, employee.id);
  };


  const avatarSize = 40 + (zoomLevel * 10); 
  const nodeWidth = 140 + (zoomLevel * 20); 
  
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


const OrgChart = ({ employees, handleDrop, zoomLevel, setZoomLevel }) => {
 
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
        
  
        const teamChips = clonedDoc.querySelectorAll('.team-chip');
        teamChips.forEach(chip => {
          chip.style.display = 'none';
        });

  
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
    
  
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      45,
      imgWidth,
      imgHeight
    );
    

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
    
    pdf.setDrawColor(219, 98, 0);
    pdf.setLineWidth(0.5);
    pdf.line(20, 42, 190, 42);
    

    pdf.setDrawColor(219, 98, 0);
    pdf.setLineWidth(1);
    pdf.rect(10, 10, 190, 277);
    

    pdf.setDrawColor(219, 98, 0);
    pdf.setLineWidth(1);

    pdf.line(10, 15, 20, 15);
    pdf.line(15, 10, 15, 20);
 
    pdf.line(190, 15, 200, 15);
    pdf.line(195, 10, 195, 20);
 
    pdf.line(10, 282, 20, 282);
    pdf.line(15, 277, 15, 287);

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


const ChartPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0); // 0 is default, range from -2 to 3
  
 
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

 
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

  
  useEffect(() => {
    const uniqueTeams = [...new Set(employees.map(emp => emp.team))];
    setTeams(uniqueTeams);
  }, [employees]);


  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  
  const handleDrop = async (employeeId, newManagerId) => {
    
    if (employeeId === newManagerId || wouldCreateCircularReference(employeeId, newManagerId)) {
      return;
    }

    try {
  
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === employeeId ? { ...emp, managerId: newManagerId } : emp
        )
      );
      
  
      const response = await fetch(`/api/employees/${employeeId}/manager`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ managerId: newManagerId }),
      });
      
      const result = await response.json();
      
      setToastMessage(`${result.employeeName} is now reporting to ${result.managerName}`);
      setToastOpen(true);
      
      console.log(result.message); 
    } catch (err) {
      console.error('Error updating employee manager:', err);
     
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data);
    }
  };

  
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

  
  const filteredChartEmployees = selectedTeam
    ? employees.filter(emp => {
        
        if (emp.team === selectedTeam) return true;
        
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
      
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <SuccessToast>
          <AnimatedCheckIcon />
          <Typography sx={{ fontWeight: 500 }}>{toastMessage}</Typography>
        </SuccessToast>
      </Snackbar>
      
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


window.addEventListener('beforeunload', () => {
  if (server) {
    server.shutdown();
  }
});

export default ChartPage;
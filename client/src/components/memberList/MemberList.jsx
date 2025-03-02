import React from 'react';
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Paper, Avatar, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './MemberList.scss'

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
}));

const DarkFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.7)',
    },
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const MemberList = ({ 
  isOpen, 
  toggleSidebar, 
  employees,
  searchTerm,
  selectedTeam,
  onSearchChange,
  onTeamChange,
  teams 
}) => {
  // Get team color
  const getTeamColor = (team) => {
    switch (team) {
      case 'Executive': return '#4caf50';
      case 'Engineering': return '#2196f3';
      case 'IT': return '#9c27b0';
      case 'Finance': return '#ff9800';
      default: return '#e0e0e0';
    }
  };

  const onDragStart = (e, employeeId) => {
    e.dataTransfer.setData('employeeId', employeeId);
  };

  // Filter employees based on search and team selection
  let filteredEmployees = employees;
  
  // Filter by team if a team is selected
  if (selectedTeam) {
    filteredEmployees = filteredEmployees.filter(emp => emp.team === selectedTeam);
  }
  
  // Filter by search term
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchLower) || 
      emp.designation.toLowerCase().includes(searchLower) || 
      emp.team.toLowerCase().includes(searchLower)
    );
  }

  return (
    <Box 
      className={`sidebar ${isOpen ? 'open' : 'closed'}`}
      sx={{ 
        backgroundColor: '#333333', // Dark grey background
        height: 'calc(100vh - 5rem)',
        overflow: 'scroll',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 12px rgba(0, 0, 0, 0.2)',
        transition: 'width 0.3s ease',
        position: 'relative',
        zIndex: 10,
        width: isOpen ? '320px' : '60px',
        left: 0,
        color: 'white' 
      }}
    >
      <Box 
        className="sidebar-header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'space-between' : 'center',
          padding: isOpen ? '0px' : '12px 0',
          background: 'linear-gradient(135deg, #222222,rgb(50, 50, 50))', // Darker gradient
          color: 'white'
        }}
      >
        {isOpen && (
          <Typography 
            variant="h6" 
            className="panel-title"
            sx={{ fontWeight: 600, color: 'white' }}
          >
            Employee Directory
          </Typography>
        )}
        <IconButton 
          onClick={toggleSidebar} 
          color="inherit" 
          className="sidebar-toggle"
          sx={{ color: 'white' }}
        >
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      
      {isOpen && (
        <Box 
          className="employee-list-container"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#333333' // Dark grey background
          }}
        >
          <Box 
            className="search-filter-container"
            sx={{
              padding: '12px',
              backgroundColor: '#444444' // Slightly lighter dark grey
            }}
          >
            <StyledSearchInput
              placeholder="Search employees"
              value={searchTerm}
              onChange={onSearchChange}
              fullWidth
              margin="normal"
              className="search-input"
              sx={{ marginBottom: '8px' }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ ml: 1, mr: 0.5, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
            />
            
            <DarkFormControl fullWidth variant="outlined" className="team-select" sx={{ marginTop: '4px' }}>
              <InputLabel>Filter by Team</InputLabel>
              <Select
                value={selectedTeam}
                onChange={onTeamChange}
                label="Filter by Team"
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#444444',
                      color: 'white'
                    }
                  }
                }}
              >
                <MenuItem value="" sx={{ color: 'white' }}>All Teams</MenuItem>
                {teams.map(team => (
                  <MenuItem key={team} value={team} sx={{ color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: getTeamColor(team) 
                        }} 
                      />
                      {team}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </DarkFormControl>
          </Box>
          
          <Box 
            className="employee-list"
            sx={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              backgroundColor: '#333333' // Dark grey background
            }}
          >
            {filteredEmployees.map(employee => (
              <Paper 
                key={employee.id} 
                className="employee-list-item"
                draggable
                onDragStart={(e) => onDragStart(e, employee.id)}
                elevation={2}
                sx={{ 
                  borderLeft: `4px solid ${getTeamColor(employee.team)}`,
                  padding: '8px',
                  marginBottom: '12px',
                  borderRadius: '8px',
                  cursor: 'move',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#444444', // Darker card background
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box 
                  className="employee-card-content"
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Avatar 
                    src={employee.image} 
                    alt={employee.name} 
                    className="employee-card-avatar"
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      border: '2px solid #555555',
                      marginRight: '12px'
                    }}
                  />
                  <Box 
                    className="employee-card-info"
                    sx={{ flex: 1 }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      className="employee-name"
                      sx={{
                        fontWeight: 600,
                        marginBottom: '2px',
                        color: 'white', // White text
                        fontSize: '0.95rem'
                      }}
                    >
                      {employee.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      className="employee-designation"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)', // Light white text
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '1px'
                      }}
                    >
                      <WorkIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom', fontSize: '0.9rem' }} />
                      {employee.designation}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      className="employee-team"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)', // Light white text
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '1px'
                      }}
                    >
                      <BusinessIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom', fontSize: '0.9rem' }} />
                      {employee.team}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MemberList;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  TablePagination,
  TextField,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem
} from '@mui/material';
import {
  Search,
  People,
  Person,
  AdminPanelSettings,
  Article,
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  Publish,
  Article as Draft,
  Schedule,
  Spa,
  AttachMoney,
  CalendarMonth,
  LocalOffer,
  Close,
  Email,
  Phone,
  Shield
} from '@mui/icons-material';
import { userAPI, blogAPI, transactionAPI, packageAPI,authAPI} from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState(null);
  const [blogPage, setBlogPage] = useState(0);
  const [blogRowsPerPage, setBlogRowsPerPage] = useState(10);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [blogMenuAnchor, setBlogMenuAnchor] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [packages, setPackages] = useState([]);
  const [pkgLoading, setPkgLoading] = useState(false);
  const [pkgError, setPkgError] = useState(null);
  const [pkgDialogOpen, setPkgDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [pkgFormData, setPkgFormData] = useState({
    name: '', description: '', duration: '', durationUnit: 'days',
    price: '', discount: '0', features: '', category: 'yoga', level: 'all'
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [userPackagesDialogOpen, setUserPackagesDialogOpen] = useState(false);
  const [userPackages, setUserPackages] = useState([]);
  const [userPackagesLoading, setUserPackagesLoading] = useState(false);
  const [userDetailDialogOpen, setUserDetailDialogOpen] = useState(false);

  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
const [newUserForm, setNewUserForm] = useState({
  firstName: '', lastName: '', email: '', password: '', 
  phone: '', role: 'user'
});
// Assign Package Dialog
const [assignPkgDialogOpen, setAssignPkgDialogOpen] = useState(false);
const [assignPkgForm, setAssignPkgForm] = useState({
  packageId: '', paymentStatus: 'completed', paymentDate: new Date().toISOString().split('T')[0]
});
// Edit Transaction Dialog
const [editTxnDialogOpen, setEditTxnDialogOpen] = useState(false);
const [editingTransaction, setEditingTransaction] = useState(null);
const [editTxnForm, setEditTxnForm] = useState({
  paymentStatus: '', paymentMethod: '', paymentDate: '', notes: ''
});
  const [txnDialogOpen, setTxnDialogOpen] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    if (activeTab === 0) fetchUsers();
    else if (activeTab === 1) fetchBlogs();
    else if (activeTab === 2) fetchPackages();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getUsers({ page: page + 1, limit: rowsPerPage });
      if (response.data.success) {
        setUsers(response.data.users || []);
        setTotalUsers(response.data.pagination?.totalUsers || 0);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setBlogLoading(true);
      setBlogError(null);
      const response = await blogAPI.getBlogs({ page: blogPage + 1, limit: blogRowsPerPage });
      if (response.data.success) {
        setBlogs(response.data.blogs || []);
        setTotalBlogs(response.data.pagination?.totalBlogs || 0);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setBlogError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setBlogLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      setPkgLoading(true);
      setPkgError(null);
      const response = await packageAPI.getPackages();
      if (response.data.success) {
        setPackages(response.data.packages || []);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setPkgError('Failed to fetch packages');
    } finally {
      setPkgLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleBlogChangePage = (event, newPage) => setBlogPage(newPage);
  const handleBlogChangeRowsPerPage = (event) => {
    setBlogRowsPerPage(parseInt(event.target.value, 10));
    setBlogPage(0);
  };

  const handleBlogMenuOpen = (event, blog) => {
    console.log('Blog menu opened for:', blog?._id, blog?.title);
    console.log('Blog full object:', blog);
    setBlogMenuAnchor(event.currentTarget);
    setSelectedBlog(blog);
  };
  const handleBlogMenuClose = () => {
    setBlogMenuAnchor(null);
  };

  const handleEditBlog = () => {
    if (selectedBlog) navigate(`/edit-blog/${selectedBlog._id}`);
    handleBlogMenuClose();
  };
  const handleViewBlog = () => {
    if (selectedBlog) navigate(`/blog/${selectedBlog.slug}`);
    handleBlogMenuClose();
  };
  const handleDeleteBlog = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBlog = async () => {
    try {
      console.log('confirmDeleteBlog called, selectedBlog:', selectedBlog);
      const blogId = selectedBlog?.id || selectedBlog?._id;
      if (selectedBlog && blogId) {
        console.log('Deleting blog:', blogId, selectedBlog.title);
        const response = await blogAPI.deleteBlog(blogId);
        console.log('Delete response:', response.data);
        if (response.data.success) {
          fetchBlogs();
          setSelectedBlog(null);
        } else {
          setBlogError(response.data.message || 'Failed to delete blog');
        }
      } else {
        console.error('No blog selected for deletion');
        setBlogError('No blog selected');
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      console.error('Error response:', err.response?.data);
      setBlogError(err.response?.data?.message || 'Failed to delete blog');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleViewUserPackages = async (user) => {
    if (!user || !user._id) {
      console.error('Invalid user object:', user);
      return;
    }
    setSelectedUser(user);
    setUserPackagesDialogOpen(true);
    setUserPackagesLoading(true);
    setUserPackages([]);
    try {
      console.log('Fetching packages for user:', user._id, user.firstName);
      const response = await transactionAPI.getUserTransactions(user._id);
      console.log('Response:', response.data);
      if (response.data.success) {
        setUserPackages(response.data.transactions || []);
      } else {
        console.error('API returned success: false');
        setUserPackages([]);
      }
    } catch (err) {
      console.error('Error fetching user packages:', err);
      console.error('Error response:', err.response?.data);
      setUserPackages([]);
    } finally {
      setUserPackagesLoading(false);
    }
  };

  const handleOpenPkgForm = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setPkgFormData({
        name: pkg.name || '',
        description: pkg.description || '',
        duration: pkg.duration || '',
        durationUnit: pkg.durationUnit || 'days',
        price: pkg.price || '',
        discount: pkg.discount || '0',
        features: pkg.features?.join('\n') || '',
        category: pkg.category || 'yoga',
        level: pkg.level || 'all'
      });
    } else {
      setEditingPackage(null);
      setPkgFormData({
        name: '', description: '', duration: '', durationUnit: 'days',
        price: '', discount: '0', features: '', category: 'yoga', level: 'all'
      });
    }
    setPkgDialogOpen(true);
  };

  const handleSavePackage = async () => {
    try {
      const packageData = {
        ...pkgFormData,
        duration: parseInt(pkgFormData.duration),
        price: parseFloat(pkgFormData.price),
        discount: parseFloat(pkgFormData.discount),
        features: pkgFormData.features.split('\n').filter(f => f.trim())
      };
      if (editingPackage) {
        await packageAPI.updatePackage(editingPackage._id, packageData);
      } else {
        await packageAPI.createPackage(packageData);
      }
      fetchPackages();
      setPkgDialogOpen(false);
    } catch (err) {
      console.error('Error saving package:', err);
      setPkgError('Failed to save package');
    }
  };

  const handleDeletePackage = async (pkgId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await packageAPI.deletePackage(pkgId);
        fetchPackages();
      } catch (err) {
        console.error('Error deleting package:', err);
        setPkgError('Failed to delete package');
      }
    }
  };

  const handleOpenCreateUser = () => {
  setNewUserForm({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'user' });
  setCreateUserDialogOpen(true);
};
const handleSaveNewUser = async () => {
  if (!newUserForm.firstName || !newUserForm.lastName || !newUserForm.email || !newUserForm.password) {
    setError('Please fill in all required fields');
    return;
  }
  try {
    await authAPI.adminCreateUser(newUserForm);
    setNewUserForm({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'user' });
    fetchUsers();
    setCreateUserDialogOpen(false);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to create user');
  }
};
// Assign Package handlers
const handleOpenAssignPkg = async (user) => {
  setSelectedUser(user);
  setAssignPkgForm({ packageId: '', paymentStatus: 'completed', paymentDate: new Date().toISOString().split('T')[0] });
  setAssignPkgDialogOpen(true);
  if (packages.length === 0) {
    setPkgLoading(true);
    try {
      const response = await packageAPI.getPackages();
      if (response.data.success) {
        setPackages(response.data.packages || []);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setPkgLoading(false);
    }
  }
};
const handleAssignPackage = async () => {
  console.log('handleAssignPackage called');
  console.log('selectedUser:', selectedUser);
  console.log('assignPkgForm:', assignPkgForm);
  console.log('Assign button clicked');
  if (!selectedUser || !selectedUser._id) {
    setError('No user selected');
    return;
  }
  if (!assignPkgForm.packageId) {
    setError('Please select a package');
    return;
  }
  console.log('All validation passed, calling API...');
  try {
    console.log('Calling API with:', {
      userId: selectedUser._id,
      packageId: assignPkgForm.packageId,
      paymentStatus: assignPkgForm.paymentStatus,
      paymentMethod: 'admin-assigned',
      paymentDate: assignPkgForm.paymentDate
    });
    await transactionAPI.createTransaction({
      userId: selectedUser._id,
      packageId: assignPkgForm.packageId,
      paymentStatus: assignPkgForm.paymentStatus,
      paymentMethod: 'admin-assigned',
      paymentDate: assignPkgForm.paymentDate
    });
    setAssignPkgDialogOpen(false);
    fetchPackages();
    alert('Package assigned successfully');
  } catch (err) {
    console.error('Error assigning package:', err);
    console.error('Error response:', err.response?.data);
    setError(err.response?.data?.message || 'Failed to assign package');
  }
};
// Edit Transaction handlers
const handleEditTransaction = (txn) => {
  setEditingTransaction(txn);
  setEditTxnForm({
    paymentStatus: txn.paymentStatus,
    paymentMethod: txn.paymentMethod || 'card',
    paymentDate: txn.paymentDate ? new Date(txn.paymentDate).toISOString().split('T')[0] : '',
    notes: txn.notes || ''
  });
  setEditTxnDialogOpen(true);
};
const handleSaveTransaction = async () => {
  try {
    await transactionAPI.updateTransaction(editingTransaction._id, editTxnForm);
    setEditTxnDialogOpen(false);
    handleViewUserPackages(selectedUser);
  } catch (err) {
    setError('Failed to update transaction');
  }
};

const handleViewUserDetail = async (user) => {
  setSelectedUser(user);
  setUserDetailDialogOpen(true);
  setUserPackagesLoading(true);
  try {
    const response = await transactionAPI.getUserTransactions(user._id);
    if (response.data.success) {
      setUserPackages(response.data.transactions || []);
    } else {
      setUserPackages([]);
    }
  } catch (err) {
    console.error('Error fetching user packages:', err);
    setUserPackages([]);
  } finally {
    setUserPackagesLoading(false);
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'scheduled': return 'info';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'refunded': return 'error';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const renderUsersTab = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
  <Grid item xs={12} sm={4}>
    <Card><CardContent sx={{ display: 'flex', alignItems: 'center' }}>
      <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
      <Box>
        <Typography variant="h4">{totalUsers}</Typography>
        <Typography color="textSecondary">Total Users</Typography>
      </Box>
    </CardContent></Card>
  </Grid>
</Grid>
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
  <Typography variant="h6">Users Management</Typography>
  <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreateUser}>
    Add User
  </Button>
</Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Users Management</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={24} /></TableCell></TableRow>
                ) : users.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center">No users found</TableCell></TableRow>
                ) : users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Avatar src={user.profilePhoto} alt={user.firstName} sx={{ width: 40, height: 40 }}>
                        {user.firstName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">{user.firstName} {user.lastName}</Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role || 'user'} color={user.role === 'admin' ? 'error' : 'primary'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => handleViewUserDetail(user)}
                        sx={{ mr: 1 }}
                      >
                        Detail
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Spa />}
                        onClick={() => handleViewUserPackages(user)}
                        sx={{ mr: 1 }}
                      >
                        Packages
                      </Button>
                      <Button size="small" variant="contained" onClick={() => handleOpenAssignPkg(user)}>
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination component="div" count={totalUsers} page={page} onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25, 50]} />
        </CardContent>
      </Card>
    </>
  );

  const renderBlogsTab = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card><CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Article sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4">{totalBlogs}</Typography>
              <Typography color="textSecondary">Total Blogs</Typography>
            </Box>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField placeholder="Search blogs..." sx={{ flexGrow: 1, mr: 2 }} />
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/create-blog')}>Add New Blog</Button>
      </Box>

      {blogError && <Alert severity="error" sx={{ mb: 3 }}>{blogError}</Alert>}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Blog Management</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogLoading ? (
                  <TableRow><TableCell colSpan={5} align="center"><CircularProgress size={24} /></TableCell></TableRow>
                ) : blogs.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center">No blogs found</TableCell></TableRow>
                ) : blogs.map((blog) => (
                  <TableRow key={blog._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" noWrap>{blog.title || 'Untitled'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={blog.author?.profilePhoto} sx={{ width: 32, height: 32, mr: 1 }}>
                          {blog.author?.firstName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Typography variant="body2">{blog.author?.firstName} {blog.author?.lastName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={blog.isPublished ? 'Published' : 'Draft'}
                        color={getStatusColor(blog.isPublished ? 'published' : 'draft')} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{formatDate(blog.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => handleBlogMenuOpen(e, blog)}><MoreVert /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination component="div" count={totalBlogs} page={blogPage} onPageChange={handleBlogChangePage}
            rowsPerPage={blogRowsPerPage} onRowsPerPageChange={handleBlogChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25, 50]} />
        </CardContent>
      </Card>
    </>
  );

  const renderPackagesTab = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Yoga Packages Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenPkgForm()}>Add Package</Button>
      </Box>

      {pkgError && <Alert severity="error" sx={{ mb: 3 }}>{pkgError}</Alert>}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Package</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pkgLoading ? (
                  <TableRow><TableCell colSpan={8} align="center"><CircularProgress size={24} /></TableCell></TableRow>
                ) : packages.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center">No packages found</TableCell></TableRow>
                ) : packages.map((pkg) => (
                  <TableRow key={pkg._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">{pkg.name}</Typography>
                    </TableCell>
                    <TableCell><Chip label={pkg.category} size="small" variant="outlined" /></TableCell>
                    <TableCell>{pkg.duration} {pkg.durationUnit}</TableCell>
<TableCell>
                      {pkg.discount > 0 && (
                        <Typography variant="caption" sx={{ textDecoration: 'line-through', mr: 0.5, color: 'text.secondary' }}>
                          {`$${pkg.price}`}
                        </Typography>
                      )}
                      <Typography variant="body2" fontWeight="500" color="success.main">
                        {`$${(pkg.price * (1 - pkg.discount / 100)).toFixed(2)}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {pkg.discount > 0 ? <Chip icon={<LocalOffer />} label={`${pkg.discount}%`} size="small" color="warning" /> : '-'}
                    </TableCell>
                    <TableCell><Chip label={pkg.level} size="small" variant="outlined" /></TableCell>
                    <TableCell>
                      <Chip label={pkg.isActive ? 'Active' : 'Inactive'} color={pkg.isActive ? 'success' : 'default'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenPkgForm(pkg)}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDeletePackage(pkg._id)}><Delete fontSize="small" color="error" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>Admin Dashboard</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab icon={<People />} label="Users" iconPosition="start" />
          <Tab icon={<Article />} label="Blogs" iconPosition="start" />
          <Tab icon={<Spa />} label="Packages" iconPosition="start" />
        </Tabs>
      </Box>

      {activeTab === 0 && renderUsersTab()}
      {activeTab === 1 && renderBlogsTab()}
      {activeTab === 2 && renderPackagesTab()}

      <Menu anchorEl={blogMenuAnchor} open={Boolean(blogMenuAnchor)} onClose={handleBlogMenuClose}>
        <MenuItem onClick={handleViewBlog}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditBlog}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteBlog}>
          <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Blog Post</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{selectedBlog?.title || 'Unknown'}"? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteBlog} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={userPackagesDialogOpen} onClose={() => setUserPackagesDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Spa color="primary" />
            {selectedUser?.firstName} {selectedUser?.lastName}'s Packages
          </Box>
        </DialogTitle>
        <DialogContent>
          {userPackagesLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading packages...</Typography>
            </Box>
          ) : userPackages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Spa sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography color="text.secondary">No packages purchased yet</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Package Name</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Payment ($)</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Payment Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userPackages.map((txn) => (
                    <TableRow key={txn._id}>
                      <TableCell><Typography variant="body2" fontWeight="medium">{txn.packageId?.name || 'N/A'}</Typography></TableCell>
                      <TableCell>{txn.packageId?.duration} {txn.packageId?.durationUnit}</TableCell>
                      <TableCell>
                        {txn.packageId?.discount > 0 && (
                          <Typography variant="caption" sx={{ textDecoration: 'line-through', mr: 0.5 }}>
                            {`$${txn.originalPrice?.toFixed(2)}`}
                          </Typography>
                        )}
                        <Typography variant="body2" color="success.main" fontWeight="500">
                          {`$${txn.paymentAmount?.toFixed(2)}`}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(txn.paymentDate)}</TableCell>
                      <TableCell>{formatDate(txn.startDate)}</TableCell>
                      <TableCell>{formatDate(txn.endDate)}</TableCell>
                      <TableCell>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={txn.paymentStatus} color={getPaymentStatusColor(txn.paymentStatus)} size="small" variant="outlined" />
                                <IconButton size="small" onClick={() => handleEditTransaction(txn)}>
                                      <Edit fontSize="small" />
                                </IconButton>
                          </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserPackagesDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={pkgDialogOpen} onClose={() => setPkgDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPackage ? 'Edit Package' : 'Add Package'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Package Name" value={pkgFormData.name} onChange={(e) => setPkgFormData({ ...pkgFormData, name: e.target.value })} fullWidth />
            <TextField label="Description" value={pkgFormData.description} onChange={(e) => setPkgFormData({ ...pkgFormData, description: e.target.value })} multiline rows={2} fullWidth />
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField label="Duration" type="number" value={pkgFormData.duration} onChange={(e) => setPkgFormData({ ...pkgFormData, duration: e.target.value })} fullWidth /></Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select value={pkgFormData.durationUnit} onChange={(e) => setPkgFormData({ ...pkgFormData, durationUnit: e.target.value })} label="Unit">
                    <MuiMenuItem value="days">Days</MuiMenuItem>
                    <MuiMenuItem value="weeks">Weeks</MuiMenuItem>
                    <MuiMenuItem value="months">Months</MuiMenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField label="Price ($)" type="number" value={pkgFormData.price} onChange={(e) => setPkgFormData({ ...pkgFormData, price: e.target.value })} fullWidth /></Grid>
              <Grid item xs={6}><TextField label="Discount (%)" type="number" value={pkgFormData.discount} onChange={(e) => setPkgFormData({ ...pkgFormData, discount: e.target.value })} fullWidth /></Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={pkgFormData.category} onChange={(e) => setPkgFormData({ ...pkgFormData, category: e.target.value })} label="Category">
                    <MuiMenuItem value="yoga">Yoga</MuiMenuItem>
                    <MuiMenuItem value="meditation">Meditation</MuiMenuItem>
                    <MuiMenuItem value="fitness">Fitness</MuiMenuItem>
                    <MuiMenuItem value="mixed">Mixed</MuiMenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select value={pkgFormData.level} onChange={(e) => setPkgFormData({ ...pkgFormData, level: e.target.value })} label="Level">
                    <MuiMenuItem value="beginner">Beginner</MuiMenuItem>
                    <MuiMenuItem value="intermediate">Intermediate</MuiMenuItem>
                    <MuiMenuItem value="advanced">Advanced</MuiMenuItem>
                    <MuiMenuItem value="all">All Levels</MuiMenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField label="Features (one per line)" value={pkgFormData.features} onChange={(e) => setPkgFormData({ ...pkgFormData, features: e.target.value })} multiline rows={3} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPkgDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSavePackage} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createUserDialogOpen} onClose={() => setCreateUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="First Name" value={newUserForm.firstName}
              onChange={(e) => setNewUserForm({...newUserForm, firstName: e.target.value})} fullWidth required />
            <TextField label="Last Name" value={newUserForm.lastName}
              onChange={(e) => setNewUserForm({...newUserForm, lastName: e.target.value})} fullWidth required />
            <TextField label="Email" type="email" value={newUserForm.email}
              onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})} fullWidth required />
            <TextField label="Password" type="password" value={newUserForm.password}
              onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})} fullWidth required />
            <TextField label="Phone" value={newUserForm.phone}
              onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select value={newUserForm.role} onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})} label="Role">
                <MuiMenuItem value="user">User</MuiMenuItem>
                <MuiMenuItem value="admin">Admin</MuiMenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateUserDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNewUser} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Package Dialog */}
      <Dialog open={assignPkgDialogOpen} onClose={() => setAssignPkgDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Package to User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Typography>User: {selectedUser?.firstName} {selectedUser?.lastName} ({selectedUser?.email})</Typography>
            <FormControl fullWidth>
              <InputLabel>Package</InputLabel>
              <Select value={assignPkgForm.packageId} onChange={(e) => setAssignPkgForm({...assignPkgForm, packageId: e.target.value})} label="Package">
                {pkgLoading ? (
                  <MuiMenuItem value="">Loading packages...</MuiMenuItem>
                ) : packages.length === 0 ? (
                  <MuiMenuItem value="">No packages available</MuiMenuItem>
                ) : (
                  packages.map(pkg => (
                    <MuiMenuItem key={pkg._id} value={pkg._id}>{pkg.name} - ${pkg.price}</MuiMenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select value={assignPkgForm.paymentStatus} onChange={(e) => setAssignPkgForm({...assignPkgForm, paymentStatus: e.target.value})} label="Payment Status">
                <MuiMenuItem value="pending">Pending</MuiMenuItem>
                <MuiMenuItem value="completed">Completed</MuiMenuItem>
              </Select>
            </FormControl>
            <TextField label="Payment Date" type="date" value={assignPkgForm.paymentDate}
              onChange={(e) => setAssignPkgForm({...assignPkgForm, paymentDate: e.target.value})} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignPkgDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignPackage} variant="contained">Assign</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={editTxnDialogOpen} onClose={() => setEditTxnDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Payment Status</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select value={editTxnForm.paymentStatus} onChange={(e) => setEditTxnForm({...editTxnForm, paymentStatus: e.target.value})} label="Payment Status">
                <MuiMenuItem value="pending">Pending</MuiMenuItem>
                <MuiMenuItem value="completed">Completed</MuiMenuItem>
                <MuiMenuItem value="failed">Failed</MuiMenuItem>
                <MuiMenuItem value="refunded">Refunded</MuiMenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select value={editTxnForm.paymentMethod} onChange={(e) => setEditTxnForm({...editTxnForm, paymentMethod: e.target.value})} label="Payment Method">
                <MuiMenuItem value="card">Card</MuiMenuItem>
                <MuiMenuItem value="cash">Cash</MuiMenuItem>
                <MuiMenuItem value="other">Other</MuiMenuItem>
              </Select>
            </FormControl>
            <TextField label="Payment Date" type="date" value={editTxnForm.paymentDate}
              onChange={(e) => setEditTxnForm({...editTxnForm, paymentDate: e.target.value})} fullWidth />
            <TextField label="Notes" value={editTxnForm.notes} multiline rows={2}
              onChange={(e) => setEditTxnForm({...editTxnForm, notes: e.target.value})} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTxnDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveTransaction} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog open={userDetailDialogOpen} onClose={() => setUserDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="primary" />
            User Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedUser.profilePhoto} sx={{ width: 80, height: 80 }}>
                  {selectedUser.firstName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedUser.firstName} {selectedUser.lastName}</Typography>
                  <Chip
                    label={selectedUser.role || 'user'}
                    color={selectedUser.role === 'admin' ? 'error' : 'primary'}
                    size="small"
                    variant="outlined"
                    icon={<Shield />}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email color="action" />
                  <Typography variant="body1">{selectedUser.email}</Typography>
                </Box>
                {selectedUser.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Phone color="action" />
                    <Typography variant="body1">{selectedUser.phone}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarMonth color="action" />
                  <Typography variant="body1">Joined: {formatDate(selectedUser.createdAt)}</Typography>
                </Box>
              </Box>

              {selectedUser.bio && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Bio</Typography>
                  <Typography variant="body2">{selectedUser.bio}</Typography>
                </Box>
              )}

              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Spa sx={{ mr: 1 }} />
                  Assigned Packages
                </Typography>
                {userPackagesLoading ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1 }}>Loading packages...</Typography>
                  </Box>
                ) : userPackages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Spa sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">No packages assigned yet</Typography>
                  </Box>
                ) : (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Package</TableCell>
                          <TableCell>Duration</TableCell>
                          <TableCell>Payment Status</TableCell>
                          <TableCell>End Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userPackages.map((txn) => (
                          <TableRow key={txn._id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {txn.packageId?.name || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {txn.packageId?.duration} {txn.packageId?.durationUnit}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={txn.paymentStatus}
                                color={getPaymentStatusColor(txn.paymentStatus)}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{formatDate(txn.endDate)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default AdminDashboard;
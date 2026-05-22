const Package = require('../models/Package');

const packageController = {
  getAllPackages: async (req, res) => {
    try {
      const { category, level, minPrice, maxPrice, sort = '-createdAt' } = req.query;
      
      let query = { isActive: true };
      
      if (category) query.category = category;
      if (level) query.level = level;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
      }
      
      const packages = await Package.find(query).sort(sort);
      
      res.json({
        success: true,
        count: packages.length,
        packages
      });
    } catch (error) {
      console.error('Get packages error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch packages'
      });
    }
  },

  getPackageById: async (req, res) => {
    try {
      const package = await Package.findById(req.params.id);
      
      if (!package) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }
      
      res.json({
        success: true,
        package
      });
    } catch (error) {
      console.error('Get package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch package'
      });
    }
  },

  createPackage: async (req, res) => {
    try {
      const { name, description, duration, durationUnit, price, discount, features, category, level } = req.body;

      console.log('Creating package with data:', req.body);

      const parsedDuration = parseInt(duration);
      const parsedPrice = parseFloat(price);

      if (!name || !description || !duration || isNaN(parsedDuration) || parsedDuration < 1) {
        return res.status(400).json({ success: false, message: 'Name, description, and valid duration are required' });
      }
      if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ success: false, message: 'Valid price is required' });
      }

      const packageData = {
        name,
        description,
        duration: parsedDuration,
        durationUnit: durationUnit || 'days',
        price: parsedPrice,
        discount: parseFloat(discount) || 0,
        features: features || [],
        category: category || 'yoga',
        level: level || 'all',
        createdBy: req.user ? req.user._id : null
      };

      console.log('Package data to save:', packageData);

      const newPackage = new Package(packageData);
      await newPackage.save();
      
      res.status(201).json({
        success: true,
        message: 'Package created successfully',
        package: newPackage
      });
    } catch (error) {
      console.error('Create package error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create package',
        error: error.message
      });
    }
  },

  updatePackage: async (req, res) => {
    try {
      const { name, description, duration, durationUnit, price, discount, features, category, level, isActive } = req.body;
      
      const packageData = {
        name,
        description,
        duration: parseInt(duration),
        durationUnit,
        price: parseFloat(price),
        discount: parseFloat(discount) || 0,
        features: features || [],
        category,
        level
      };
      
      if (isActive !== undefined) packageData.isActive = isActive;
      
      const updatedPackage = await Package.findByIdAndUpdate(
        req.params.id,
        packageData,
        { new: true, runValidators: true }
      );
      
      if (!updatedPackage) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Package updated successfully',
        package: updatedPackage
      });
    } catch (error) {
      console.error('Update package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update package'
      });
    }
  },

  deletePackage: async (req, res) => {
    try {
      const deletedPackage = await Package.findByIdAndDelete(req.params.id);
      
      if (!deletedPackage) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Package deleted successfully'
      });
    } catch (error) {
      console.error('Delete package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete package'
      });
    }
  },

  getPackageStats: async (req, res) => {
    try {
      const totalPackages = await Package.countDocuments({ isActive: true });
      const yogaPackages = await Package.countDocuments({ isActive: true, category: 'yoga' });
      const meditationPackages = await Package.countDocuments({ isActive: true, category: 'meditation' });
      
      const avgPrice = await Package.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, avgPrice: { $avg: '$price' } } }
      ]);
      
      res.json({
        success: true,
        stats: {
          totalPackages,
          yogaPackages,
          meditationPackages,
          avgPrice: avgPrice[0]?.avgPrice || 0
        }
      });
    } catch (error) {
      console.error('Get package stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch stats'
      });
    }
  }
};

module.exports = packageController;
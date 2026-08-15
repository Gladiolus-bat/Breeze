// GET /api/user/
export const getUserData = async (req, res) => {
  try {
    const { _id, username, email, image, role, recentSearchedCities } = req.user;
    res.json({
      success: true,
      user: { id: _id, username, email, image, role, recentSearchedCities },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Store User Recent Searched Cities
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const user = req.user;

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }
    await user.save();
    res.json({ success: true, message: "City added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

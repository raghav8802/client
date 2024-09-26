import { Modal } from "@/components/Modal";
import UserContext from "@/context/userContext";
import { apiPost } from "@/helpers/axiosRequest";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import Loading from "./ui/Loading";

// Helper functions to validate and extract required parts from URLs
const validateAndExtract = {
  spotify: (url: string) => {
    const regex = /^https:\/\/open\.spotify\.com\/artist\/([\w\d]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },
  apple: (url: string) => {
    const regex = /^https:\/\/music\.apple\.com\/.*\/artist\/.*\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },
  instagram: (url: string) => {
    const regex = /^https:\/\/www\.instagram\.com\/([\w\.\_]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },
  facebook: (url: string) => {
    const regex = /^https:\/\/www\.facebook\.com\/([\w\.]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },
};

const ArtistModalForm = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;
  
  // Initialize form data with all fields
  const [formData, setFormData] = useState({
    artistName: "",
    spotifyID: "",
    appleID: "",
    instagramID: "",
    facebookID: "",
    isIPRSMember: false,
    iprsNumber: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [artistType, setArtistType] = useState({
    singer: false,
    lyricist: false,
    composer: false,
    producer: false,
  });
  
  // Initialize errors for all fields
  const [errors, setErrors] = useState({
    artistName: "",
    spotifyID: "",
    appleID: "",
    instagramID: "",
    facebookID: "",
    artistType: "",
    iprsNumber: "",
  });

  // Function to validate artist types (at least one must be selected)
  const validateArtistType = (types: typeof artistType) => {
    return Object.values(types).some((type) => type);
  };

  // Handle input changes and perform validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newFormData = { ...formData };
    let newErrors = { ...errors };

    if (type === "checkbox") {
      setArtistType((prev) => {
        const updatedTypes = { ...prev, [name]: checked };
        // Validate artist types
        newErrors.artistType = validateArtistType(updatedTypes)
          ? ""
          : "At least one artist type must be selected.";
        setErrors(newErrors);
        return updatedTypes;
      });
      return;
    }

    if (type === "radio") {
      newFormData[name as keyof typeof formData] = value === "true";
      setFormData(newFormData);
      // If IPRS Member is set to false, clear iprsNumber and errors
      if (name === "isIPRSMember" && value === "false") {
        newFormData.iprsNumber = "";
        newErrors.iprsNumber = "";
      }
      setFormData(newFormData);
      setErrors(newErrors);
      return;
    }

    newFormData[name as keyof typeof formData] = value;

    // Validation logic
    switch (name) {
      case "artistName":
        newErrors.artistName = value.trim() ? "" : "Artist name is required.";
        break;
      case "spotify":
        const spotifyID = validateAndExtract.spotify(value);
        newFormData.spotifyID = spotifyID || "";
        newErrors.spotifyID = spotifyID ? "" : "Enter a valid Spotify URL.";
        break;
      case "apple":
        const appleID = validateAndExtract.apple(value);
        newFormData.appleID = appleID || "";
        newErrors.appleID = appleID ? "" : "Enter a valid Apple Music URL.";
        break;
      case "instagram":
        const instagramID = validateAndExtract.instagram(value);
        newFormData.instagramID = instagramID || "";
        newErrors.instagramID = instagramID ? "" : "Enter a valid Instagram URL.";
        break;
      case "facebook":
        const facebookID = validateAndExtract.facebook(value);
        newFormData.facebookID = facebookID || "";
        newErrors.facebookID = facebookID ? "" : "Enter a valid Facebook URL.";
        break;
      case "iprsNumber":
        if (formData.isIPRSMember) {
          newErrors.iprsNumber = /^\d{12}$/.test(value)
            ? ""
            : "Enter a valid 12-digit IPRS Number.";
        } else {
          newErrors.iprsNumber = "";
        }
        break;
      default:
        break;
    }

    setFormData(newFormData);
    setErrors(newErrors);
  };

  // Handle form submission
  const handleSave = async () => {
    // Perform final validation before submission
    let valid = true;
    let newErrors = { ...errors };

    // Validate artist name
    if (!formData.artistName.trim()) {
      newErrors.artistName = "Artist name is required.";
      valid = false;
    }

    // Validate social media URLs
    ["spotify", "apple", "instagram", "facebook"].forEach((field) => {
      const id = formData[`${field}ID` as keyof typeof formData];
      if (!id) {
        newErrors[`${field}ID` as keyof typeof newErrors] = `Enter a valid ${capitalize(
          field
        )} URL.`;
        valid = false;
      }
    });

    // Validate artist types
    if (!validateArtistType(artistType)) {
      newErrors.artistType = "At least one artist type must be selected.";
      valid = false;
    }

    // Validate IPRS Number if member
    if (formData.isIPRSMember) {
      if (!/^\d{12}$/.test(formData.iprsNumber)) {
        newErrors.iprsNumber = "Enter a valid 12-digit IPRS Number.";
        valid = false;
      }
    }

    setErrors(newErrors);

    if (!valid) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    const data = {
      labelId: labelId,
      artistName: formData.artistName,
      iprs: formData.isIPRSMember,
      iprsNumber: formData.iprsNumber,
      facebook: formData.facebookID,
      appleMusic: formData.appleID,
      spotify: formData.spotifyID,
      instagram: formData.instagramID,
      isSinger: artistType.singer,
      isLyricist: artistType.lyricist,
      isComposer: artistType.composer,
      isProducer: artistType.producer,
    };

    try {
      const response = await apiPost("/api/artist/addArtist", data);
      if (response.success) {
        setFormData({
          artistName: "",
          spotifyID: "",
          appleID: "",
          instagramID: "",
          facebookID: "",
          isIPRSMember: false,
          iprsNumber: "",
        });
        setArtistType({
          singer: false,
          lyricist: false,
          composer: false,
          producer: false,
        });
        setErrors({
          artistName: "",
          spotifyID: "",
          appleID: "",
          instagramID: "",
          facebookID: "",
          artistType: "",
          iprsNumber: "",
        });
        onClose();
        toast.success("New artist added successfully.");
      } else {
        toast.error(response.message || "Failed to add new artist.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the artist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Capitalize helper function
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (isSubmitting) {
    return (
      <div className="w-full flex justify-center items-center p-4">
        <Loading />
      </div>
    );
  }

  return (
    <Modal
      isVisible={isVisible}
      triggerLabel="Submit"
      title="New Artist"
      onSave={handleSave}
      onClose={onClose}
      description="Note: You can add multiple artist types to a single artist"
    >
      {/* Artist Name */}
      <div className="mb-4">
        <label className="form-label" htmlFor="artistName">
          Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="artistName"
          name="artistName"
          value={formData.artistName}
          onChange={handleInputChange}
          className={`form-control ${errors.artistName ? "error" : ""}`}
          placeholder="Write artist name"
          required
        />
        {errors.artistName && (
          <p className="text-red-600 text-sm mt-1">{errors.artistName}</p>
        )}
      </div>

      {/* Social Media Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Spotify */}
        <div>
          <label className="form-label" htmlFor="spotify">
            Spotify URL <span className="text-red-600">*</span>
          </label>
          <input
            type="url"
            id="spotify"
            name="spotify"
            value={formData.spotifyID}
            onChange={handleInputChange}
            className={`form-control ${errors.spotifyID ? "error" : ""}`}
            placeholder="Spotify URL of artist"
            required
          />
          {errors.spotifyID && (
            <p className="text-red-600 text-sm mt-1">{errors.spotifyID}</p>
          )}
        </div>

        {/* Apple Music */}
        <div>
          <label className="form-label" htmlFor="apple">
            Apple Music URL <span className="text-red-600">*</span>
          </label>
          <input
            type="url"
            id="apple"
            name="apple"
            value={formData.appleID}
            onChange={handleInputChange}
            className={`form-control ${errors.appleID ? "error" : ""}`}
            placeholder="Apple Music URL of artist"
            required
          />
          {errors.appleID && (
            <p className="text-red-600 text-sm mt-1">{errors.appleID}</p>
          )}
        </div>

        {/* Instagram */}
        <div>
          <label className="form-label" htmlFor="instagram">
            Instagram URL <span className="text-red-600">*</span>
          </label>
          <input
            type="url"
            id="instagram"
            name="instagram"
            value={formData.instagramID}
            onChange={handleInputChange}
            className={`form-control ${errors.instagramID ? "error" : ""}`}
            placeholder="Instagram URL of artist"
            required
          />
          {errors.instagramID && (
            <p className="text-red-600 text-sm mt-1">{errors.instagramID}</p>
          )}
        </div>

        {/* Facebook */}
        <div>
          <label className="form-label" htmlFor="facebook">
            Facebook URL <span className="text-red-600">*</span>
          </label>
          <input
            type="url"
            id="facebook"
            name="facebook"
            value={formData.facebookID}
            onChange={handleInputChange}
            className={`form-control ${errors.facebookID ? "error" : ""}`}
            placeholder="Facebook URL of artist"
            required
          />
          {errors.facebookID && (
            <p className="text-red-600 text-sm mt-1">{errors.facebookID}</p>
          )}
        </div>
      </div>

      {/* IPRS Member */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* IPRS Membership */}
        <div>
          <label className="form-label" htmlFor="isIPRSMember">
            IPRS Member? <span className="text-red-600">*</span>
          </label>
          <ul className="flex items-center mt-2">
            <li className="w-1/2">
              <div className="flex items-center">
                <input
                  id="iprsMemberYes"
                  type="radio"
                  value="true"
                  name="isIPRSMember"
                  className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer"
                  checked={formData.isIPRSMember === true}
                  onChange={handleInputChange}
                  required
                />
                <label
                  htmlFor="iprsMemberYes"
                  className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Yes
                </label>
              </div>
            </li>

            <li className="w-1/2">
              <div className="flex items-center">
                <input
                  id="iprsMemberNo"
                  type="radio"
                  value="false"
                  name="isIPRSMember"
                  className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer"
                  checked={formData.isIPRSMember === false}
                  onChange={handleInputChange}
                  required
                />
                <label
                  htmlFor="iprsMemberNo"
                  className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  No
                </label>
              </div>
            </li>
          </ul>
          {errors.isIPRSMember && (
            <p className="text-red-600 text-sm mt-1">{errors.isIPRSMember}</p>
          )}
        </div>

        {/* IPRS Number */}
        <div>
          <label className="form-label" htmlFor="iprsNumber">
            IPRS Number {formData.isIPRSMember && <span className="text-red-600">*</span>}
          </label>
          <input
            type="text"
            id="iprsNumber"
            name="iprsNumber"
            disabled={!formData.isIPRSMember}
            value={formData.iprsNumber}
            onChange={handleInputChange}
            className={`form-control ${
              formData.isIPRSMember ? "" : "form-disabled"
            } ${errors.iprsNumber ? "error" : ""}`}
            placeholder="Enter 12-digit IPRS Number"
            maxLength={12}
            required={formData.isIPRSMember}
          />
          {errors.iprsNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.iprsNumber}</p>
          )}
        </div>
      </div>

      {/* Artist Types */}
      <div className="mt-4">
        <label className="form-label">
          Artist Type <span className="text-red-600">*</span>
        </label>
        <div className="flex flex-wrap mt-2">
          {["singer", "lyricist", "composer", "producer"].map((type) => (
            <div key={type} className="flex items-center mr-6 mb-2">
              <input
                id={`artistType-${type}`}
                type="checkbox"
                name={type}
                checked={artistType[type as keyof typeof artistType]}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`artistType-${type}`}
                className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {capitalize(type)}
              </label>
            </div>
          ))}
        </div>
        {errors.artistType && (
          <p className="text-red-600 text-sm mt-1">{errors.artistType}</p>
        )}
      </div>
    </Modal>
  );
};

export default ArtistModalForm;

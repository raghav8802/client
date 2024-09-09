'use client'

import { Modal } from '@/components/Modal';
import UserContext from '@/context/userContext';
import { apiPost } from '@/helpers/axiosRequest';
import React, { useContext, useEffect, useState } from 'react';
import toast from "react-hot-toast";




const CopyRightsModalForm = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {

  const context = useContext(UserContext);
  const labelId = context?.user?._id;
  // console.log("labelId");
  // console.log(labelId);


  const [formData, setFormData] = useState({
    trackId: '',
    youtubeUrl: ''
  });


  const handleSave = async () => {

    // console.log("all data");
    // console.log(formData);

    if (!formData.trackId && formData.trackId === '') {
      toast.error("Please select a track")
      return
    }
    if (!formData.youtubeUrl && formData.youtubeUrl === '') {
      toast.error("Please paste your youtube link")
      return
    }

    const response = await apiPost('/api/copyright/addCopyright',
      {
        labelId, trackId: '668973a1256cc9a680905130', link: formData.youtubeUrl
      })

    if (response.success) {
      onClose();
      toast.success("New Copyright added")
      setFormData({ trackId: "", youtubeUrl: "" })
    }else{
      onClose();
      toast.success("Internal server error")
    }


  };

  return (
    <Modal
      isVisible={isVisible}
      triggerLabel="Submit"
      title="New Copyright"
      onSave={handleSave}
      onClose={onClose}
    >

      <div>
        <label className="form-label" htmlFor="trackname">Track</label>

        <select
          name="track"
          className='form-select outline-none'
          id="trackname"
          value={formData.trackId}
          onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
        >
          <option value="">Select Track</option>
          <option value="Songid">Songname</option>
        </select>


      </div>

       <div>
            <label className="form-label" htmlFor="youtubeUrl">YouTube URL</label>
            <input
              id="youtubeUrl"
              type="text"
              name="youtubeUrl"
              placeholder="Paste your YouTube URL here"
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              onBlur={(e) => {
                const value = e.target.value;
                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
                
                if (!youtubeRegex.test(value) && value !== "") {
                  alert("Please enter a valid YouTube URL");
                  // Optionally reset the input if invalid
                  setFormData({ ...formData, youtubeUrl: "" });
                }
              }}
              className="form-control"
            />
        </div>



    </Modal>
  );
};

export default CopyRightsModalForm;




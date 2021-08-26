package com.gsr.blogger.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gsr.blogger.IntegrationTest;
import com.gsr.blogger.domain.MUser;
import com.gsr.blogger.repository.MUserRepository;
import com.gsr.blogger.service.dto.MUserDTO;
import com.gsr.blogger.service.mapper.MUserMapper;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link MUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MUserResourceIT {

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final Instant DEFAULT_DOB = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DOB = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_ABOUT = "AAAAAAAAAA";
    private static final String UPDATED_ABOUT = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PROFILE_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_PICTURE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/m-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MUserRepository mUserRepository;

    @Autowired
    private MUserMapper mUserMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMUserMockMvc;

    private MUser mUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MUser createEntity(EntityManager em) {
        MUser mUser = new MUser()
            .username(DEFAULT_USERNAME)
            .email(DEFAULT_EMAIL)
            .dob(DEFAULT_DOB)
            .about(DEFAULT_ABOUT)
            .profilePicture(DEFAULT_PROFILE_PICTURE)
            .profilePictureContentType(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE);
        return mUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MUser createUpdatedEntity(EntityManager em) {
        MUser mUser = new MUser()
            .username(UPDATED_USERNAME)
            .email(UPDATED_EMAIL)
            .dob(UPDATED_DOB)
            .about(UPDATED_ABOUT)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
        return mUser;
    }

    @BeforeEach
    public void initTest() {
        mUser = createEntity(em);
    }

    @Test
    @Transactional
    void createMUser() throws Exception {
        int databaseSizeBeforeCreate = mUserRepository.findAll().size();
        // Create the MUser
        MUserDTO mUserDTO = mUserMapper.toDto(mUser);
        restMUserMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mUserDTO))
            )
            .andExpect(status().isCreated());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeCreate + 1);
        MUser testMUser = mUserList.get(mUserList.size() - 1);
        assertThat(testMUser.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testMUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testMUser.getDob()).isEqualTo(DEFAULT_DOB);
        assertThat(testMUser.getAbout()).isEqualTo(DEFAULT_ABOUT);
        assertThat(testMUser.getProfilePicture()).isEqualTo(DEFAULT_PROFILE_PICTURE);
        assertThat(testMUser.getProfilePictureContentType()).isEqualTo(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createMUserWithExistingId() throws Exception {
        // Create the MUser with an existing ID
        mUser.setId(1L);
        MUserDTO mUserDTO = mUserMapper.toDto(mUser);

        int databaseSizeBeforeCreate = mUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMUserMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMUsers() throws Exception {
        // Initialize the database
        mUserRepository.saveAndFlush(mUser);

        // Get all the mUserList
        restMUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].dob").value(hasItem(DEFAULT_DOB.toString())))
            .andExpect(jsonPath("$.[*].about").value(hasItem(DEFAULT_ABOUT)))
            .andExpect(jsonPath("$.[*].profilePictureContentType").value(hasItem(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profilePicture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_PICTURE))));
    }

    @Test
    @Transactional
    void getMUser() throws Exception {
        // Initialize the database
        mUserRepository.saveAndFlush(mUser);

        // Get the mUser
        restMUserMockMvc
            .perform(get(ENTITY_API_URL_ID, mUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mUser.getId().intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.dob").value(DEFAULT_DOB.toString()))
            .andExpect(jsonPath("$.about").value(DEFAULT_ABOUT))
            .andExpect(jsonPath("$.profilePictureContentType").value(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.profilePicture").value(Base64Utils.encodeToString(DEFAULT_PROFILE_PICTURE)));
    }

    @Test
    @Transactional
    void getNonExistingMUser() throws Exception {
        // Get the mUser
        restMUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMUser() throws Exception {
        // Initialize the database
        mUserRepository.saveAndFlush(mUser);

        int databaseSizeBeforeUpdate = mUserRepository.findAll().size();

        // Update the mUser
        MUser updatedMUser = mUserRepository.findById(mUser.getId()).get();
        // Disconnect from session so that the updates on updatedMUser are not directly saved in db
        em.detach(updatedMUser);
        updatedMUser
            .username(UPDATED_USERNAME)
            .email(UPDATED_EMAIL)
            .dob(UPDATED_DOB)
            .about(UPDATED_ABOUT)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
        MUserDTO mUserDTO = mUserMapper.toDto(updatedMUser);

        restMUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mUserDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mUserDTO))
            )
            .andExpect(status().isOk());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeUpdate);
        MUser testMUser = mUserList.get(mUserList.size() - 1);
        assertThat(testMUser.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testMUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testMUser.getDob()).isEqualTo(UPDATED_DOB);
        assertThat(testMUser.getAbout()).isEqualTo(UPDATED_ABOUT);
        assertThat(testMUser.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testMUser.getProfilePictureContentType()).isEqualTo(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingMUser() throws Exception {
        int databaseSizeBeforeUpdate = mUserRepository.findAll().size();
        mUser.setId(count.incrementAndGet());

        // Create the MUser
        MUserDTO mUserDTO = mUserMapper.toDto(mUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mUserDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMUser() throws Exception {
        int databaseSizeBeforeUpdate = mUserRepository.findAll().size();
        mUser.setId(count.incrementAndGet());

        // Create the MUser
        MUserDTO mUserDTO = mUserMapper.toDto(mUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMUser() throws Exception {
        int databaseSizeBeforeUpdate = mUserRepository.findAll().size();
        mUser.setId(count.incrementAndGet());

        // Create the MUser
        MUserDTO mUserDTO = mUserMapper.toDto(mUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMUserMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mUserDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMUserWithPatch() throws Exception {
        // Initialize the database
        mUserRepository.saveAndFlush(mUser);

        int databaseSizeBeforeUpdate = mUserRepository.findAll().size();

        // Update the mUser using partial update
        MUser partialUpdatedMUser = new MUser();
        partialUpdatedMUser.setId(mUser.getId());

        partialUpdatedMUser
            .email(UPDATED_EMAIL)
            .dob(UPDATED_DOB)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);

        restMUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMUser))
            )
            .andExpect(status().isOk());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeUpdate);
        MUser testMUser = mUserList.get(mUserList.size() - 1);
        assertThat(testMUser.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testMUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testMUser.getDob()).isEqualTo(UPDATED_DOB);
        assertThat(testMUser.getAbout()).isEqualTo(DEFAULT_ABOUT);
        assertThat(testMUser.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testMUser.getProfilePictureContentType()).isEqualTo(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateMUserWithPatch() throws Exception {
        // Initialize the database
        mUserRepository.saveAndFlush(mUser);

        int databaseSizeBeforeUpdate = mUserRepository.findAll().size();

        // Update the mUser using partial update
        MUser partialUpdatedMUser = new MUser();
        partialUpdatedMUser.setId(mUser.getId());

        partialUpdatedMUser
            .username(UPDATED_USERNAME)
            .email(UPDATED_EMAIL)
            .dob(UPDATED_DOB)
            .about(UPDATED_ABOUT)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);

        restMUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMUser))
            )
            .andExpect(status().isOk());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeUpdate);
        MUser testMUser = mUserList.get(mUserList.size() - 1);
        assertThat(testMUser.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testMUser.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testMUser.getDob()).isEqualTo(UPDATED_DOB);
        assertThat(testMUser.getAbout()).isEqualTo(UPDATED_ABOUT);
        assertThat(testMUser.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testMUser.getProfilePictureContentType()).isEqualTo(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingMUser() throws Exception {
        int databaseSizeBeforeUpdate = mUserRepository.findAll().size();
        mUser.setId(count.incrementAndGet());

        // Create the MUser
        MUserDTO mUserDTO = mUserMapper.toDto(mUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mUserDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMUser() throws Exception {
        int databaseSizeBeforeUpdate = mUserRepository.findAll().size();
        mUser.setId(count.incrementAndGet());

        // Create the MUser
        MUserDTO mUserDTO = mUserMapper.toDto(mUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMUser() throws Exception {
        int databaseSizeBeforeUpdate = mUserRepository.findAll().size();
        mUser.setId(count.incrementAndGet());

        // Create the MUser
        MUserDTO mUserDTO = mUserMapper.toDto(mUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMUserMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mUserDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MUser in the database
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMUser() throws Exception {
        // Initialize the database
        mUserRepository.saveAndFlush(mUser);

        int databaseSizeBeforeDelete = mUserRepository.findAll().size();

        // Delete the mUser
        restMUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, mUser.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MUser> mUserList = mUserRepository.findAll();
        assertThat(mUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

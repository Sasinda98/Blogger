package com.gsr.blogger.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gsr.blogger.IntegrationTest;
import com.gsr.blogger.domain.UserStatistic;
import com.gsr.blogger.repository.UserStatisticRepository;
import com.gsr.blogger.service.dto.UserStatisticDTO;
import com.gsr.blogger.service.mapper.UserStatisticMapper;
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

/**
 * Integration tests for the {@link UserStatisticResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserStatisticResourceIT {

    private static final Instant DEFAULT_LAST_ACTIVE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_ACTIVE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_NUMBER_OF_POSTS = 1;
    private static final Integer UPDATED_NUMBER_OF_POSTS = 2;

    private static final Integer DEFAULT_NUMBER_OF_COMMENTS = 1;
    private static final Integer UPDATED_NUMBER_OF_COMMENTS = 2;

    private static final String ENTITY_API_URL = "/api/user-statistics";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserStatisticRepository userStatisticRepository;

    @Autowired
    private UserStatisticMapper userStatisticMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserStatisticMockMvc;

    private UserStatistic userStatistic;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserStatistic createEntity(EntityManager em) {
        UserStatistic userStatistic = new UserStatistic()
            .lastActive(DEFAULT_LAST_ACTIVE)
            .numberOfPosts(DEFAULT_NUMBER_OF_POSTS)
            .numberOfComments(DEFAULT_NUMBER_OF_COMMENTS);
        return userStatistic;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserStatistic createUpdatedEntity(EntityManager em) {
        UserStatistic userStatistic = new UserStatistic()
            .lastActive(UPDATED_LAST_ACTIVE)
            .numberOfPosts(UPDATED_NUMBER_OF_POSTS)
            .numberOfComments(UPDATED_NUMBER_OF_COMMENTS);
        return userStatistic;
    }

    @BeforeEach
    public void initTest() {
        userStatistic = createEntity(em);
    }

    @Test
    @Transactional
    void createUserStatistic() throws Exception {
        int databaseSizeBeforeCreate = userStatisticRepository.findAll().size();
        // Create the UserStatistic
        UserStatisticDTO userStatisticDTO = userStatisticMapper.toDto(userStatistic);
        restUserStatisticMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStatisticDTO))
            )
            .andExpect(status().isCreated());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeCreate + 1);
        UserStatistic testUserStatistic = userStatisticList.get(userStatisticList.size() - 1);
        assertThat(testUserStatistic.getLastActive()).isEqualTo(DEFAULT_LAST_ACTIVE);
        assertThat(testUserStatistic.getNumberOfPosts()).isEqualTo(DEFAULT_NUMBER_OF_POSTS);
        assertThat(testUserStatistic.getNumberOfComments()).isEqualTo(DEFAULT_NUMBER_OF_COMMENTS);
    }

    @Test
    @Transactional
    void createUserStatisticWithExistingId() throws Exception {
        // Create the UserStatistic with an existing ID
        userStatistic.setId(1L);
        UserStatisticDTO userStatisticDTO = userStatisticMapper.toDto(userStatistic);

        int databaseSizeBeforeCreate = userStatisticRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserStatisticMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStatisticDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserStatistics() throws Exception {
        // Initialize the database
        userStatisticRepository.saveAndFlush(userStatistic);

        // Get all the userStatisticList
        restUserStatisticMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userStatistic.getId().intValue())))
            .andExpect(jsonPath("$.[*].lastActive").value(hasItem(DEFAULT_LAST_ACTIVE.toString())))
            .andExpect(jsonPath("$.[*].numberOfPosts").value(hasItem(DEFAULT_NUMBER_OF_POSTS)))
            .andExpect(jsonPath("$.[*].numberOfComments").value(hasItem(DEFAULT_NUMBER_OF_COMMENTS)));
    }

    @Test
    @Transactional
    void getUserStatistic() throws Exception {
        // Initialize the database
        userStatisticRepository.saveAndFlush(userStatistic);

        // Get the userStatistic
        restUserStatisticMockMvc
            .perform(get(ENTITY_API_URL_ID, userStatistic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userStatistic.getId().intValue()))
            .andExpect(jsonPath("$.lastActive").value(DEFAULT_LAST_ACTIVE.toString()))
            .andExpect(jsonPath("$.numberOfPosts").value(DEFAULT_NUMBER_OF_POSTS))
            .andExpect(jsonPath("$.numberOfComments").value(DEFAULT_NUMBER_OF_COMMENTS));
    }

    @Test
    @Transactional
    void getNonExistingUserStatistic() throws Exception {
        // Get the userStatistic
        restUserStatisticMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserStatistic() throws Exception {
        // Initialize the database
        userStatisticRepository.saveAndFlush(userStatistic);

        int databaseSizeBeforeUpdate = userStatisticRepository.findAll().size();

        // Update the userStatistic
        UserStatistic updatedUserStatistic = userStatisticRepository.findById(userStatistic.getId()).get();
        // Disconnect from session so that the updates on updatedUserStatistic are not directly saved in db
        em.detach(updatedUserStatistic);
        updatedUserStatistic
            .lastActive(UPDATED_LAST_ACTIVE)
            .numberOfPosts(UPDATED_NUMBER_OF_POSTS)
            .numberOfComments(UPDATED_NUMBER_OF_COMMENTS);
        UserStatisticDTO userStatisticDTO = userStatisticMapper.toDto(updatedUserStatistic);

        restUserStatisticMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userStatisticDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStatisticDTO))
            )
            .andExpect(status().isOk());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeUpdate);
        UserStatistic testUserStatistic = userStatisticList.get(userStatisticList.size() - 1);
        assertThat(testUserStatistic.getLastActive()).isEqualTo(UPDATED_LAST_ACTIVE);
        assertThat(testUserStatistic.getNumberOfPosts()).isEqualTo(UPDATED_NUMBER_OF_POSTS);
        assertThat(testUserStatistic.getNumberOfComments()).isEqualTo(UPDATED_NUMBER_OF_COMMENTS);
    }

    @Test
    @Transactional
    void putNonExistingUserStatistic() throws Exception {
        int databaseSizeBeforeUpdate = userStatisticRepository.findAll().size();
        userStatistic.setId(count.incrementAndGet());

        // Create the UserStatistic
        UserStatisticDTO userStatisticDTO = userStatisticMapper.toDto(userStatistic);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserStatisticMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userStatisticDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStatisticDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserStatistic() throws Exception {
        int databaseSizeBeforeUpdate = userStatisticRepository.findAll().size();
        userStatistic.setId(count.incrementAndGet());

        // Create the UserStatistic
        UserStatisticDTO userStatisticDTO = userStatisticMapper.toDto(userStatistic);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStatisticMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStatisticDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserStatistic() throws Exception {
        int databaseSizeBeforeUpdate = userStatisticRepository.findAll().size();
        userStatistic.setId(count.incrementAndGet());

        // Create the UserStatistic
        UserStatisticDTO userStatisticDTO = userStatisticMapper.toDto(userStatistic);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStatisticMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStatisticDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserStatisticWithPatch() throws Exception {
        // Initialize the database
        userStatisticRepository.saveAndFlush(userStatistic);

        int databaseSizeBeforeUpdate = userStatisticRepository.findAll().size();

        // Update the userStatistic using partial update
        UserStatistic partialUpdatedUserStatistic = new UserStatistic();
        partialUpdatedUserStatistic.setId(userStatistic.getId());

        partialUpdatedUserStatistic
            .lastActive(UPDATED_LAST_ACTIVE)
            .numberOfPosts(UPDATED_NUMBER_OF_POSTS)
            .numberOfComments(UPDATED_NUMBER_OF_COMMENTS);

        restUserStatisticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserStatistic.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserStatistic))
            )
            .andExpect(status().isOk());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeUpdate);
        UserStatistic testUserStatistic = userStatisticList.get(userStatisticList.size() - 1);
        assertThat(testUserStatistic.getLastActive()).isEqualTo(UPDATED_LAST_ACTIVE);
        assertThat(testUserStatistic.getNumberOfPosts()).isEqualTo(UPDATED_NUMBER_OF_POSTS);
        assertThat(testUserStatistic.getNumberOfComments()).isEqualTo(UPDATED_NUMBER_OF_COMMENTS);
    }

    @Test
    @Transactional
    void fullUpdateUserStatisticWithPatch() throws Exception {
        // Initialize the database
        userStatisticRepository.saveAndFlush(userStatistic);

        int databaseSizeBeforeUpdate = userStatisticRepository.findAll().size();

        // Update the userStatistic using partial update
        UserStatistic partialUpdatedUserStatistic = new UserStatistic();
        partialUpdatedUserStatistic.setId(userStatistic.getId());

        partialUpdatedUserStatistic
            .lastActive(UPDATED_LAST_ACTIVE)
            .numberOfPosts(UPDATED_NUMBER_OF_POSTS)
            .numberOfComments(UPDATED_NUMBER_OF_COMMENTS);

        restUserStatisticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserStatistic.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserStatistic))
            )
            .andExpect(status().isOk());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeUpdate);
        UserStatistic testUserStatistic = userStatisticList.get(userStatisticList.size() - 1);
        assertThat(testUserStatistic.getLastActive()).isEqualTo(UPDATED_LAST_ACTIVE);
        assertThat(testUserStatistic.getNumberOfPosts()).isEqualTo(UPDATED_NUMBER_OF_POSTS);
        assertThat(testUserStatistic.getNumberOfComments()).isEqualTo(UPDATED_NUMBER_OF_COMMENTS);
    }

    @Test
    @Transactional
    void patchNonExistingUserStatistic() throws Exception {
        int databaseSizeBeforeUpdate = userStatisticRepository.findAll().size();
        userStatistic.setId(count.incrementAndGet());

        // Create the UserStatistic
        UserStatisticDTO userStatisticDTO = userStatisticMapper.toDto(userStatistic);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserStatisticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userStatisticDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userStatisticDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserStatistic() throws Exception {
        int databaseSizeBeforeUpdate = userStatisticRepository.findAll().size();
        userStatistic.setId(count.incrementAndGet());

        // Create the UserStatistic
        UserStatisticDTO userStatisticDTO = userStatisticMapper.toDto(userStatistic);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStatisticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userStatisticDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserStatistic() throws Exception {
        int databaseSizeBeforeUpdate = userStatisticRepository.findAll().size();
        userStatistic.setId(count.incrementAndGet());

        // Create the UserStatistic
        UserStatisticDTO userStatisticDTO = userStatisticMapper.toDto(userStatistic);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStatisticMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userStatisticDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserStatistic in the database
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserStatistic() throws Exception {
        // Initialize the database
        userStatisticRepository.saveAndFlush(userStatistic);

        int databaseSizeBeforeDelete = userStatisticRepository.findAll().size();

        // Delete the userStatistic
        restUserStatisticMockMvc
            .perform(delete(ENTITY_API_URL_ID, userStatistic.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserStatistic> userStatisticList = userStatisticRepository.findAll();
        assertThat(userStatisticList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

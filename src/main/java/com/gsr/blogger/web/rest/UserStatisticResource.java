package com.gsr.blogger.web.rest;

import com.gsr.blogger.repository.UserStatisticRepository;
import com.gsr.blogger.service.UserStatisticService;
import com.gsr.blogger.service.dto.UserStatisticDTO;
import com.gsr.blogger.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.gsr.blogger.domain.UserStatistic}.
 */
@RestController
@RequestMapping("/api")
public class UserStatisticResource {

    private final Logger log = LoggerFactory.getLogger(UserStatisticResource.class);

    private static final String ENTITY_NAME = "userStatistic";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserStatisticService userStatisticService;

    private final UserStatisticRepository userStatisticRepository;

    public UserStatisticResource(UserStatisticService userStatisticService, UserStatisticRepository userStatisticRepository) {
        this.userStatisticService = userStatisticService;
        this.userStatisticRepository = userStatisticRepository;
    }

    /**
     * {@code POST  /user-statistics} : Create a new userStatistic.
     *
     * @param userStatisticDTO the userStatisticDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userStatisticDTO, or with status {@code 400 (Bad Request)} if the userStatistic has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-statistics")
    public ResponseEntity<UserStatisticDTO> createUserStatistic(@RequestBody UserStatisticDTO userStatisticDTO) throws URISyntaxException {
        log.debug("REST request to save UserStatistic : {}", userStatisticDTO);
        if (userStatisticDTO.getId() != null) {
            throw new BadRequestAlertException("A new userStatistic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserStatisticDTO result = userStatisticService.save(userStatisticDTO);
        return ResponseEntity
            .created(new URI("/api/user-statistics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-statistics/:id} : Updates an existing userStatistic.
     *
     * @param id the id of the userStatisticDTO to save.
     * @param userStatisticDTO the userStatisticDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userStatisticDTO,
     * or with status {@code 400 (Bad Request)} if the userStatisticDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userStatisticDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-statistics/{id}")
    public ResponseEntity<UserStatisticDTO> updateUserStatistic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserStatisticDTO userStatisticDTO
    ) throws URISyntaxException {
        log.debug("REST request to update UserStatistic : {}, {}", id, userStatisticDTO);
        if (userStatisticDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userStatisticDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userStatisticRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserStatisticDTO result = userStatisticService.save(userStatisticDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userStatisticDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-statistics/:id} : Partial updates given fields of an existing userStatistic, field will ignore if it is null
     *
     * @param id the id of the userStatisticDTO to save.
     * @param userStatisticDTO the userStatisticDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userStatisticDTO,
     * or with status {@code 400 (Bad Request)} if the userStatisticDTO is not valid,
     * or with status {@code 404 (Not Found)} if the userStatisticDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the userStatisticDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-statistics/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<UserStatisticDTO> partialUpdateUserStatistic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserStatisticDTO userStatisticDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserStatistic partially : {}, {}", id, userStatisticDTO);
        if (userStatisticDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userStatisticDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userStatisticRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserStatisticDTO> result = userStatisticService.partialUpdate(userStatisticDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userStatisticDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /user-statistics} : get all the userStatistics.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userStatistics in body.
     */
    @GetMapping("/user-statistics")
    public List<UserStatisticDTO> getAllUserStatistics(@RequestParam(required = false) String filter) {
        if ("muser-is-null".equals(filter)) {
            log.debug("REST request to get all UserStatistics where mUser is null");
            return userStatisticService.findAllWhereMUserIsNull();
        }
        log.debug("REST request to get all UserStatistics");
        return userStatisticService.findAll();
    }

    /**
     * {@code GET  /user-statistics/:id} : get the "id" userStatistic.
     *
     * @param id the id of the userStatisticDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userStatisticDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-statistics/{id}")
    public ResponseEntity<UserStatisticDTO> getUserStatistic(@PathVariable Long id) {
        log.debug("REST request to get UserStatistic : {}", id);
        Optional<UserStatisticDTO> userStatisticDTO = userStatisticService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userStatisticDTO);
    }

    /**
     * {@code DELETE  /user-statistics/:id} : delete the "id" userStatistic.
     *
     * @param id the id of the userStatisticDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-statistics/{id}")
    public ResponseEntity<Void> deleteUserStatistic(@PathVariable Long id) {
        log.debug("REST request to delete UserStatistic : {}", id);
        userStatisticService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
